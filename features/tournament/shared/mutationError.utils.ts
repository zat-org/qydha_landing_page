import type { MutationError } from "~/composables/useMutationRequest";

export function mutationErrorDescription(
  err: MutationError | null | undefined,
  fallback = "حدث خطأ",
): string {
  const message = err?.data?.message || err?.message || fallback;
  const traceId = err?.data?.traceId;
  return traceId ? `${message} (traceId: ${traceId})` : message;
}
