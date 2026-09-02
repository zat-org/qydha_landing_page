import {
  TeamJoinRequestWorkflowState,
  type GetTeamJoinRequestsParams,
  type UpdateTournamentTeamJoinRequestsRequest,
} from "~/features/tournament/models/TournamentJoinRequest";

export function buildTeamJoinRequestsQuery(
  p: GetTeamJoinRequestsParams,
): string {
  const qs = new URLSearchParams();
  qs.set("pageNumber", String(p.pageNumber ?? 1));
  qs.set("pageSize", String(p.pageSize ?? 10));
  if (p.searchToken) qs.set("searchToken", p.searchToken);

  const states = p.getOnlyStates ?? [];
  for (const s of states) qs.append("getOnlyStates", s);

  if (p.useSelectedQualificationsPlaceIdFilter) {
    qs.set("useSelectedQualificationsPlaceIdFilter", "true");
    if (p.selectedQualificationsPlaceId === null) {
      qs.set("selectedQualificationsPlaceId", "");
    } else if (p.selectedQualificationsPlaceId) {
      qs.set("selectedQualificationsPlaceId", p.selectedQualificationsPlaceId);
    }
  }

  if (p.assignedPlaceId === null && p.useAssignedPlaceNullFilter) {
    qs.set("assignedPlaceId", "");
  } else if (p.assignedPlaceId) {
    qs.set("assignedPlaceId", p.assignedPlaceId);
  }

  return qs.toString();
}

/**
 * Dashboard join-summary counts use GET list with pageSize=1 and read totalCount only.
 * Per-place breakdown needs working filters documented in joinRequestSummary.api-brief.md.
 */
export function pagedListTotal(res: unknown): number {
  const body = res as {
    totalCount?: number;
    data?: { totalCount?: number };
  } | null;
  return body?.data?.totalCount ?? body?.totalCount ?? 0;
}

export function unwrapApiData<T>(res: unknown): T | null {
  if (res == null) return null;
  const body = res as { data?: T };
  if (body.data !== undefined) return body.data;
  return res as T;
}

export function dedupeIds(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}

export function buildMutationBody(
  selection: Pick<
    UpdateTournamentTeamJoinRequestsRequest,
    "updateSelectionType" | "joinRequestIds" | "randomRequestsCount" | "targetedPlaceId"
  >,
): UpdateTournamentTeamJoinRequestsRequest {
  return {
    updateSelectionType: selection.updateSelectionType,
    joinRequestIds: dedupeIds(selection.joinRequestIds ?? []),
    randomRequestsCount: selection.randomRequestsCount ?? 0,
    targetedPlaceId: selection.targetedPlaceId ?? null,
  };
}

export function selectedIdsBody(
  joinRequestIds: string[],
  targetedPlaceId: string | null = null,
): UpdateTournamentTeamJoinRequestsRequest {
  return buildMutationBody({
    updateSelectionType: "SelectedIds",
    joinRequestIds,
    randomRequestsCount: 0,
    targetedPlaceId,
  });
}

export function randomRequestsBody(
  randomRequestsCount: number,
  targetedPlaceId: string | null,
): UpdateTournamentTeamJoinRequestsRequest {
  return buildMutationBody({
    updateSelectionType: "RandomRequests",
    joinRequestIds: [],
    randomRequestsCount,
    targetedPlaceId,
  });
}

export function allApplicableBody(): UpdateTournamentTeamJoinRequestsRequest {
  return buildMutationBody({
    updateSelectionType: "AllApplicable",
    joinRequestIds: [],
    randomRequestsCount: 0,
    targetedPlaceId: null,
  });
}

export interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
}

export function extractApiErrorMessage(error: unknown): string {
  const err = error as {
    data?: ApiErrorPayload;
    response?: { _data?: ApiErrorPayload };
  };
  const data = err.data ?? err.response?._data;
  if (data?.errors) {
    const fieldMessages = Object.values(data.errors).flat();
    if (fieldMessages.length) return fieldMessages.join(" · ");
  }
  if (data?.message) return data.message;
  return "تعذر تنفيذ الإجراء";
}

/** States accepted by GET `getOnlyStates` filter on staging. */
export const ORGANIZER_VISIBLE_JOIN_STATES: TeamJoinRequestWorkflowState[] = [
  TeamJoinRequestWorkflowState.WaitingOrganizerConsideration,
  TeamJoinRequestWorkflowState.WaitingOrganizerApproval,
  TeamJoinRequestWorkflowState.CanceledByOrganizer,
  TeamJoinRequestWorkflowState.InWaitingList,
  TeamJoinRequestWorkflowState.ApprovedByOrganizer,
];

/** Tab presets for organizer list views. */
export const JOIN_REQUEST_TAB_STATES: Record<
  "consideration" | "approval" | "canceled" | "waitingList",
  TeamJoinRequestWorkflowState[]
> = {
  consideration: [TeamJoinRequestWorkflowState.WaitingOrganizerConsideration],
  approval: [TeamJoinRequestWorkflowState.WaitingOrganizerApproval],
  canceled: [TeamJoinRequestWorkflowState.CanceledByOrganizer],
  waitingList: [TeamJoinRequestWorkflowState.InWaitingList],
};
