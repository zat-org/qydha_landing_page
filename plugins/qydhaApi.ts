export default defineNuxtPlugin(() => {
  // get user data if it exist or not
  const config = useRuntimeConfig();
  const $Qapi = $fetch.create({
    baseURL: config.public.qydhaapiBase as string,
    headers: {
      Authorization: `Bearer ${config.public.qydhaToken}`,
    },
  });

  return {
    provide: {
      qaydhaapi: $Qapi,
    },
  };
});
