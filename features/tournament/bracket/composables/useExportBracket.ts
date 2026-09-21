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
  return value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80) || "bracket";
}

export function buildBracketExportFilename(
  parts: Array<string | null | undefined>,
) {
  const stamp = new Date().toISOString().slice(0, 10);
  return sanitizeFilename([...parts.filter(Boolean), stamp].join("-"));
}

async function waitForPaint(ms = 180) {
  await nextTick();
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, ms);
    });
  });
}

async function captureElementDataUrl(
  element: HTMLElement,
  format: Exclude<BracketExportFormat, "pdf">,
  backgroundColor: string,
) {
  const base = {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor,
  } as const;

  if (format === "jpg") {
    return toJpeg(element, { ...base, quality: 0.92 });
  }
  return toPng(element, base);
}

async function saveAsPdf(dataUrl: string, filenameBase: string) {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("تعذر تجهيز صورة التصدير"));
    img.src = dataUrl;
  });

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
 * Capture a mounted bracket DOM node (prefer `.vue-flow` after fitView).
 */
export async function exportBracketElement(
  element: HTMLElement,
  format: BracketExportFormat,
  filenameBase: string,
  backgroundColor = "#ffffff",
) {
  if (format === "pdf") {
    const dataUrl = await captureElementDataUrl(element, "png", backgroundColor);
    await saveAsPdf(dataUrl, filenameBase);
    return;
  }

  const dataUrl = await captureElementDataUrl(element, format, backgroundColor);
  downloadDataUrl(dataUrl, `${filenameBase}.${format === "jpg" ? "jpg" : "png"}`);
}

export function useExportBracket() {
  const exporting = ref(false);
  const toast = useToast();

  async function exportFromFlow(options: {
    prepare?: () => void | Promise<void>;
    getElement: () => HTMLElement | null | undefined;
    format: BracketExportFormat;
    filenameBase: string;
    backgroundColor?: string;
  }) {
    if (exporting.value) return;
    exporting.value = true;
    try {
      await options.prepare?.();
      await waitForPaint();
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
  }

  return {
    exporting,
    exportFromFlow,
  };
}
