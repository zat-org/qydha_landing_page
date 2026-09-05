const FORBIDDEN_MATCH_ACTION =
  "ليست لديك صلاحية لهذه المباراة. قد تكون صلاحية مشرف المكان تغيرت.";

export function matchManagementErrorDescription(
  error: { statusCode?: number; message?: string } | null | undefined,
  fallback: string,
) {
  if (error?.statusCode === 403) return FORBIDDEN_MATCH_ACTION;
  return error?.message || fallback;
}
