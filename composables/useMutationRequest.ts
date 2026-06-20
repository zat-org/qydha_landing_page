type MutationStatus = "idle" | "pending" | "success" | "error";

export type MutationError = {
  message?: string;
  data?: { code?: string; errors?: Record<string, string[]> };
};

export function useMutationRequest() {
  const pending = ref(false);
  const status = ref<MutationStatus>("idle");
  const error = ref<MutationError | null>(null);

  const execute = async (request: () => Promise<void>) => {
    pending.value = true;
    status.value = "pending";
    error.value = null;

    try {
      await request();
      status.value = "success";
    } catch (err) {
      status.value = "error";
      error.value = err as MutationError;
    } finally {
      pending.value = false;
    }
  };

  return { pending, status, error, execute };
}
