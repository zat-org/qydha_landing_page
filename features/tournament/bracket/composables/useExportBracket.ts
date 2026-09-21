import { toJpeg, toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export type BracketExportFormat = "png" | "jpg" | "pdf";

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function sanitizeFilename(value: string) {
  return (
    value
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) || "bracket"
  );
}

export function buildBracketExportFilename(
  parts: Array<string | null | undefined>,
) {
  const stamp = new Date().toISOString().slice(0, 10);
  return sanitizeFilename([...parts.filter(Boolean), stamp].join("-"));
}

/** Yield so Vue Flow / OBS painting is not starved by export work. */
function yieldToMain() {
  return new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve(), { timeout: 120 });
      return;
    }
    setTimeout(resolve, 0);
  });
}

async function captureElementDataUrl(
  element: HTMLElement,
  format: Exclude<BracketExportFormat, "pdf">,
  backgroundColor: string | undefined,
) {
  const base = {
    cacheBust: true,
    pixelRatio: 2,
    ...(backgroundColor ? { backgroundColor } : {}),
    filter: (node: HTMLElement) => {
      if (!(node instanceof HTMLElement)) return true;
      return !node.classList?.contains("bracket-obs-export");
    },
  } as const;

  if (format === "jpg") {
    return toJpeg(element, {
      ...base,
      quality: 0.92,
      backgroundColor: backgroundColor ?? "#ffffff",
    });
  }
  return toPng(element, base);
}

async function saveAsPdf(dataUrl: string, filenameBase: string) {
  await yieldToMain();
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("تعذر تجهيز صورة التصدير"));
    img.src = dataUrl;
  });

  await yieldToMain();
  const orientation = img.width >= img.height ? "landscape" : "portrait";
  const pdf = new jsPDF({
    orientation,
    unit: "px",
    format: [img.width, img.height],
    hotfixes: ["px_scaling"],
  });
  pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
  pdf.save(`${filenameBase}.pdf`);
}

/**
 * Capture a mounted bracket DOM node (prefer `.vue-flow`).
 * Heavy work is chunked with yields so the UI / OBS stream stays responsive.
 */
export async function exportBracketElement(
  element: HTMLElement,
  format: BracketExportFormat,
  filenameBase: string,
  backgroundColor?: string,
) {
  await yieldToMain();

  if (format === "pdf") {
    const dataUrl = await captureElementDataUrl(
      element,
      "png",
      backgroundColor,
    );
    await saveAsPdf(dataUrl, filenameBase);
    return;
  }

  const dataUrl = await captureElementDataUrl(
    element,
    format,
    backgroundColor,
  );
  await yieldToMain();
  downloadDataUrl(
    dataUrl,
    `${filenameBase}.${format === "jpg" ? "jpg" : "png"}`,
  );
}

export function useExportBracket() {
  const exporting = ref(false);
  const toast = useToast();

  /**
   * Queues export as a background job: returns immediately after scheduling.
   * Does not await capture on the caller — UI/OBS keep running.
   */
  function exportFromFlow(options: {
    /** Optional prep (avoid fitView in OBS — it jerks the stream). */
    prepare?: () => void | Promise<void>;
    getElement: () => HTMLElement | null | undefined;
    format: BracketExportFormat;
    filenameBase: string;
    backgroundColor?: string;
  }) {
    if (exporting.value) return;
    exporting.value = true;

    toast.add({
      title: "جاري تصدير الخريطة…",
      description: "سيكتمل في الخلفية دون إيقاف الصفحة",
      color: "info",
    });

    void (async () => {
      try {
        await yieldToMain();
        await options.prepare?.();
        await yieldToMain();

        const element = options.getElement();
        if (!element) {
          throw new Error("لم يتم العثور على خريطة البطولة");
        }

        await exportBracketElement(
          element,
          options.format,
          options.filenameBase,
          options.backgroundColor,
        );

        toast.add({
          title: "تم التصدير بنجاح",
          color: "success",
        });
      } catch (error) {
        console.error("Bracket export failed", error);
        toast.add({
          title: "تعذر تصدير الخريطة",
          description:
            error instanceof Error ? error.message : "حدث خطأ غير متوقع",
          color: "error",
        });
      } finally {
        exporting.value = false;
      }
    })();
  }

  return {
    exporting,
    exportFromFlow,
  };
}
