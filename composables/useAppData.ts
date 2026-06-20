import type { AsyncDataOptions, NuxtApp, NuxtError } from "#app";
import type { MaybeRefOrGetter } from "vue";

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

type AsyncDataRequestContext = {
  cause: "initial" | "refresh:manual" | "refresh:hook" | "watch";
};
type AppDataHandler<DataT> = (
  nuxtApp: NuxtApp,
  ctx: { signal: AbortSignal },
) => Promise<DataT>;

type AppApiDataHandler<DataT> = (
  nuxtApp: NuxtApp,
  ctx: { signal: AbortSignal },
) => Promise<ApiResponse<DataT>>;

/** Read cached payload/static data for a useAppData key. */
export function appGetCachedData<DataT>(
  key: string,
  nuxtApp: NuxtApp,
  ctx: AsyncDataRequestContext,
): DataT | undefined {
  if (ctx.cause === "refresh:manual" || ctx.cause === "refresh:hook")
    return undefined;
  return nuxtApp.payload.data[key];
}

/** Stable cache key from a prefix and serializable params. */
export function buildAppDataKey(prefix: string, params: unknown): string {
  return `${prefix}:${JSON.stringify(params)}`;
}

const withAppCache = <DataT>(
  options?: AsyncDataOptions<DataT>,
): AsyncDataOptions<DataT> => ({
  getCachedData: appGetCachedData,
  ...options,
});

const withApiTransform = <DataT>(
  options?: AsyncDataOptions<DataT>,
): AsyncDataOptions<DataT> => ({
  ...withAppCache(options),
  transform: (response) => (response as ApiResponse<DataT>).data,
});

export function useAppData<DataT, ErrorT = NuxtError<DataT>>(
  key: MaybeRefOrGetter<string>,
  handler: AppDataHandler<DataT>,
  options?: AsyncDataOptions<DataT>,
) {
  return useAsyncData<DataT, ErrorT>(key, handler, withAppCache(options));
}

export function useAppLazyData<DataT, ErrorT = NuxtError<DataT>>(
  key: MaybeRefOrGetter<string>,
  handler: AppDataHandler<DataT>,
  options?: AsyncDataOptions<DataT>,
) {
  return useLazyAsyncData<DataT, ErrorT>(key, handler, withAppCache(options));
}

/** GET helper — unwraps backend `{ data, message }` so `data` ref holds `T` directly. */
export function useAppApiData<DataT, ErrorT = NuxtError<DataT>>(
  key: MaybeRefOrGetter<string>,
  handler: AppApiDataHandler<DataT>,
  options?: AsyncDataOptions<DataT>,
) {
  return useAsyncData<DataT, ErrorT>(
    key,
    handler as unknown as AppDataHandler<DataT>,
    withApiTransform(options),
  );
}

/** Lazy GET helper — unwraps backend `{ data, message }` so `data` ref holds `T` directly. */
export function useAppLazyApiData<DataT, ErrorT = NuxtError<DataT>>(
  key: MaybeRefOrGetter<string>,
  handler: AppApiDataHandler<DataT>,
  options?: AsyncDataOptions<DataT>,
) {
  return useLazyAsyncData<DataT, ErrorT>(
    key,
    handler as unknown as AppDataHandler<DataT>,
    withApiTransform(options),
  );
}
