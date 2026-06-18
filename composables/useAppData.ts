import type { AsyncDataOptions, NuxtApp, NuxtError } from '#app'
import type { MaybeRefOrGetter } from 'vue'

type AppDataHandler<DataT> = (
   nuxtApp: NuxtApp,
  ctx: { signal: AbortSignal },
) => Promise<DataT>

/** Read cached payload/static data for a useAppData key. */
export function appGetCachedData<DataT>(
  key: string,
  nuxtApp: NuxtApp,
): DataT | undefined {
  return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
}

/** Stable cache key from a prefix and serializable params. */
export function buildAppDataKey(prefix: string, params: unknown): string {
  return `${prefix}:${JSON.stringify(params)}`
}

const withAppCache = <DataT>(
  options?: AsyncDataOptions<DataT>,
): AsyncDataOptions<DataT> => ({
  getCachedData: appGetCachedData,
  ...options,
})

export function useAppData<DataT, ErrorT = NuxtError<DataT>>(
  key: MaybeRefOrGetter<string>,
  handler: AppDataHandler<DataT>,
  options?: AsyncDataOptions<DataT>,
) {
  return useAsyncData<DataT, ErrorT>(key, handler, withAppCache(options))
}

export function useAppLazyData<DataT, ErrorT = NuxtError<DataT>>(
  key: MaybeRefOrGetter<string>,
  handler: AppDataHandler<DataT>,
  options?: AsyncDataOptions<DataT>,
) {
  return useLazyAsyncData<DataT, ErrorT>(key, handler, withAppCache(options))
}
