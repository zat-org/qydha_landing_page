import type { WhatsappMessageCreateI } from "~/models/marketing";

export const useMarketing = () => {
  const { $api } = useNuxtApp();
  const getTemplates = async () => {
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{ data: string[]; message: string }>(
        "getTemplates",
        () => $api("/marketing/whatsapp-messages-templates"),
        { immediate: false }
      );
    const fetchREQ = async () => {
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const addWhatsAppMessage = async () => {
    const body = ref<WhatsappMessageCreateI>();
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        "addWhatsAppMessage",
        () =>
          $api("/marketing/whatsapp-messages", {
            method: "post",
            body: body.value,
          }),
        { immediate: false }
      );
    const fetchREQ = async (newMessage: WhatsappMessageCreateI) => {
      body.value = newMessage;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };
  return { getTemplates, addWhatsAppMessage };
};
