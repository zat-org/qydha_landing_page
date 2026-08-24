import type {
  INotificationCreate,
  INotificationPopupCreate,
} from "~/models/notification";

export const useNotification = () => {
  const { $api } = useNuxtApp();

  const getAllNotifications = () =>
    useAppApiData(appKeys.notifications, () =>
      $api("/notifications/users/anonymous"),
    );

  const sendNotificationToAllUsers = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      new_notification: INotificationCreate | INotificationPopupCreate,
      to: "All" | "User" | "Anonymos" = "All",
      user?: string,
    ) => {
      await execute(async () => {
        const body = new FormData();
        body.append("actionPath", new_notification.actionPath);
        body.append("actionType", new_notification.actionType);
        body.append("description", new_notification.description);
        body.append("title", new_notification.title);
        if (
          "popUpImage" in new_notification &&
          new_notification.popUpImage instanceof File
        ) {
          body.append("popUpImage", new_notification.popUpImage);
        }

        let target = "";
        if (to === "User" && user) {
          target = user;
        } else if (to === "Anonymos") {
          target = "anonymous";
        }

        await $api(`/notifications/users/${target}`, {
          method: "post",
          body,
        });
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { sendNotificationToAllUsers, getAllNotifications };
};
