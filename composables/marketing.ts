import type { WhatsappMessageCreateI } from "~/models/marketing";

export const useMarketing = () => {
  const { $api } = useNuxtApp();

  const getTemplates = async () => {
    const { data, pending, error, refresh, status, execute } =
      await useAppApiData<string[]>(
        appKeys.marketing,
        () => $api("/marketing/whatsapp-messages-templates"),
        { immediate: false },
      );

    const fetchREQ = async () => {
      await execute();
    };

    return { data, pending, error, refresh, status, fetchREQ };
  };

  const addWhatsAppMessage = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (newMessage: WhatsappMessageCreateI) => {
      await execute(async () => {
        await $api("/marketing/whatsapp-messages", {
          method: "post",
          body: newMessage,
        });
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { getTemplates, addWhatsAppMessage };
};
