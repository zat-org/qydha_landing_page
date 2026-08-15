import type { IUpdateBalootBoardSettings } from "~/models/BoardSettings";
import { useMyAuthStore } from "~/store/Auth";

export const useBoardSettings = () => {
  const { $api } = useNuxtApp();
  const { user } = storeToRefs(useMyAuthStore());

  const updateBalootBoardSettings = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_body: IUpdateBalootBoardSettings) => {
      await execute(async () => {
        await $api("/users/me/board-settings/baloot", {
          method: "put",
          body: _body,
        });
        if (user.value?.boardSettings?.baloot) {
          user.value.boardSettings.baloot.portrait = _body.portrait;
        }
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return {
    updateBalootBoardSettings,
  };
};
