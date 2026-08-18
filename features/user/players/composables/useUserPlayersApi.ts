import type { IMeUser, UserPlayer } from "~/models/user";

export type UserPlayerMutationResult = {
  data: UserPlayer;
};

async function refreshMeUser() {
  await refreshAppData(appKeys.getMeUser);
}

export const useUserPlayersApi = () => {
  const { $api } = useNuxtApp();

  const getMe = () => {
    return useAppApiData<IMeUser>(appKeys.getMeUser, () => $api("/users/me"));
  };

  const addPlayer = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (name: string, image?: File | null) => {
      await execute(async () => {
        const body = new FormData();
        body.append("name", name);
        if (image) {
          body.append("image", image);
        }
        await $api<UserPlayerMutationResult>("/users/me/players", {
          method: "post",
          body,
        });
        await refreshMeUser();
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updatePlayerName = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (playerId: string, name: string) => {
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      await execute(async () => {
        await $api(`/users/me/players/${playerId}`, {
          method: "put",
          body: { name },
          headers: {
            "Content-Type": "application/json",
          },
        });
        await refreshMeUser();
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updatePlayerImage = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (playerId: string, image: File) => {
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      await execute(async () => {
        const body = new FormData();
        body.append("image", image);
        await $api<UserPlayerMutationResult>(
          `/users/me/players/${playerId}/image`,
          {
            method: "patch",
            body,
          },
        );
        await refreshMeUser();
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const deletePlayer = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (playerId: string) => {
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      await execute(async () => {
        await $api(`/users/me/players/${playerId}`, {
          method: "delete",
        });
        await refreshMeUser();
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return {
    getMe,
    addPlayer,
    updatePlayerName,
    updatePlayerImage,
    deletePlayer,
  };
};
