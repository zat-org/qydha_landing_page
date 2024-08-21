export default defineNuxtPlugin(() => {
  // get user data if it exist or not
  const config = useRuntimeConfig();
  const $api = $fetch.create({
    baseURL: config.public.apiBase,
  });

  return {
    provide: {
      api: $api,
    },
  };
});
