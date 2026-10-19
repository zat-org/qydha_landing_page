import type { NavigationMenuItem } from "@nuxt/ui";
import { useMyAuthStore } from "~/store/Auth";

type UseNavLinksOptions = {
  onSelect?: () => void;
};

export function useNavLinks(options: UseNavLinksOptions = {}) {
  const userStore = useMyAuthStore();
  const { onSelect } = options;

  const withSelect = (item: NavigationMenuItem): NavigationMenuItem => {
    if (!onSelect) return item;
    return {
      ...item,
      onSelect: () => {
        onSelect();
      },
      children: item.children?.map((child) => withSelect(child)),
    };
  };

  const links = computed<NavigationMenuItem[]>(() => {
    const result: NavigationMenuItem[] = [];

    if (
      userStore.isSuperAdmin ||
      userStore.isStaffAdmin ||
      userStore.isOrganizer
    ) {
      result.push({ label: "البطولات", to: "/tournament" });
    }

    if (userStore.isStreamer) {
      result.push({ label: "البث", to: "/stream" });
    }

    if (userStore.isSuperAdmin) {
      result.push({
        label: "الحسابات البرمجية",
        to: "/serviceAccount",
      });
    }

    if (userStore.isSuperAdmin || userStore.isStaffAdmin) {
      result.push(
        { label: "المستخدمين ", to: "/user" },
        { label: "الاحصائيات", to: "/statistics" },
        {
          label: "التسويق",
          to: "",
          children: [
            {
              label: "اكواد ",
              to: "/Codes",
              icon: "i-heroicons-code-bracket",
            },
            {
              label: "الاشعارات ",
              to: "/notification",
              icon: "i-heroicons-bell",
            },
            {
              label: "الملف الثابت",
              to: "/assets",
              icon: "i-heroicons-document",
            },
            {
              label: "التسويق",
              to: "/marketing",
              icon: "i-heroicons-megaphone",
            },
          ],
        },
      );
    }

    return onSelect ? result.map((item) => withSelect(item)) : result;
  });

  const reversedLinks = computed(() => [...links.value].reverse());

  return { links, reversedLinks };
}
