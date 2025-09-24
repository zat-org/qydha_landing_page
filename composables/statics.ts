import type { IBalootBookStatics, IBalootStatics, IMainApplicationStatics } from "~/models/statics";
export const useStatics = () => {
  const { $api } = useNuxtApp();

  const getMainApplicationStatics = async () => {
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<IMainApplicationStatics, { code: string }>(
        "getMainApplicationStatics",
        () => $api(`/statistcs/main-application`)
      );
    return { data, pending, error, refresh, status, execute };
  };
  const getBalootStatics = async () => {
    const type = ref<"day" | "week" | "month" | "year" | "custom">("day");
    const startDate = ref<Date | null>(null);
    const endDate = ref<Date | null>(null);
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<IBalootStatics, { code: string }>(
        "getBalootStatics",
        () =>
          $api(`/statistcs/baloot-game`, {
            params: {
              from: startDate.value?.toISOString(),
              to: endDate.value?.toISOString(),
              type: type.value,
            },
          }),
        { immediate: false }
      );
    const fetchREQ = async (
      _type: "day" | "week" | "month" | "year" | "custom",
      _startDate: Date | null,
      _endDate: Date | null
    ) => {
      type.value = _type;
      if (type.value != "custom") {
        startDate.value = null;
        endDate.value = null;
      } else {
        startDate.value = _startDate;
        endDate.value = _endDate;
      }
      await execute();
    };
    return { data, pending, error, refresh, status, execute, fetchREQ };
  };
  const getBalootBookStatics = async () => {
    const type = ref<"day" | "week" | "month" | "year" | "custom">("day");
    const startDate = ref<Date | null>(null);
    const endDate = ref<Date | null>(null);
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<IBalootBookStatics>(
        "getBalootBookStatics",
        () => $api("/statistcs/baloot-book",{query:{
          from: startDate.value?.toISOString(),
          to: endDate.value?.toISOString(),
          type: type.value,
        }}),
        { immediate: false }
      );
    const fetchREQ = async (
      _type: "day" | "week" | "month" | "year" | "custom",
      _startDate: Date | null,
      _endDate: Date | null
    ) => {
      type.value = _type;
      if (type.value != "custom") {
        startDate.value = null;
        endDate.value = null;
      } else {
        startDate.value = _startDate;
        endDate.value = _endDate;
      }
      await execute();
    };
    return { data, pending, error, refresh, status, execute, fetchREQ };
  };
  return { getMainApplicationStatics, getBalootStatics, getBalootBookStatics };
};
