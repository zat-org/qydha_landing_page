import type { MutationError } from "~/composables/useMutationRequest";

export type TournamentRequestFieldErrors = Record<string, string>;

type ApiErrorBody = {
  code?: string;
  message?: string;
  traceId?: string;
  errors?: Record<string, string[] | string>;
  data?: { errors?: Record<string, string[] | string> };
};

const firstMessage = (value: string[] | string | undefined): string => {
  if (Array.isArray(value)) return String(value[0] ?? "");
  return value ? String(value) : "";
};

export const parseTournamentRequestApiErrors = (
  error: MutationError | null,
): {
  code?: string;
  message: string;
  errors: TournamentRequestFieldErrors;
  fieldKeys: string[];
} => {
  const body = (error?.data ?? null) as ApiErrorBody | null;
  const raw = body?.errors ?? body?.data?.errors ?? {};
  const errors: TournamentRequestFieldErrors = {};

  for (const [key, value] of Object.entries(raw)) {
    const message = firstMessage(value);
    if (message) errors[key] = message;
  }

  const fieldKeys = Object.keys(errors);
  const message =
    body?.message ||
    error?.message ||
    (fieldKeys.length ? "Invalid body input" : "حدث خطأ أثناء إرسال الطلب");

  return {
    code: body?.code,
    message,
    errors,
    fieldKeys,
  };
};

const fieldMatchesStep = (errorKey: string, stepField: string): boolean => {
  return (
    errorKey === stepField ||
    errorKey.startsWith(`${stepField}.`) ||
    errorKey.startsWith(`${stepField}[`)
  );
};

export const resolveStepForApiFields = (
  fieldKeys: string[],
  stepFieldMap: Record<number, string[]>,
): number => {
  const steps = Object.keys(stepFieldMap)
    .map(Number)
    .sort((a, b) => a - b);

  for (const step of steps) {
    const fields = stepFieldMap[step] ?? [];
    const hit = fieldKeys.some((key) =>
      fields.some((field) => fieldMatchesStep(key, field)),
    );
    if (hit) return step;
  }

  return 0;
};
