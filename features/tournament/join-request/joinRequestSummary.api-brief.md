# Join-request dashboard summary — backend API brief

Frontend: `useTournamentLifecycleSummary` / `JoinRequestsLifecycleSummary.vue`

## Current approach

### Global chips (6 calls)

All chip totals still use the organizer list endpoint with `pageSize=1` and read **`totalCount`** only:

```
GET /tournaments/{tournamentId}/tournament-team-join-requests
```

| UI chip | Query |
|---------|--------|
| قيد المراجعة | `getOnlyStates=WaitingOrganizerConsideration` |
| بانتظار الموافقة | `getOnlyStates=WaitingOrganizerApproval` |
| مقبولة | `getOnlyStates=ApprovedByOrganizer` |
| قائمة الانتظار | `getOnlyStates=InWaitingList` |
| ملغاة | `getOnlyStates=CanceledByOrganizer` |
| بدون تفضيل مكان | `WaitingOrganizerConsideration` + `useSelectedQualificationsPlaceIdFilter=true` + empty `selectedQualificationsPlaceId` |

**Total requests** = sum of the five state chips (organizer-visible pipeline).

### Per-place table

```
GET /tournaments/{tournamentId}/places
```

| UI label | Field |
|----------|--------|
| **السعة** | `competingTeamsCount` |
| **اختاروا** (player preferred) | `selectedJoinRequestsCount` |
| **معيّنة** (system assigned) | `assignedJoinRequestsCount` |

Plus a virtual table row **بدون تفضيل مكان** (`isNoPreference`) whose **اختاروا** count comes from the no-preference join-request list call above (not from `/places`).

### Teams summary (same places API)

| UI label | Field |
|----------|--------|
| الفرق الموجودة | `connectedTeamsCount` |
| الفرق المطلوبة | `competingTeamsCount` |

Tournament total teams still uses one `GET /teams?PageNumber=1&PageSize=1` for `totalCount` only (no page-loop).

---

## Required backend behaviour

1. **`totalCount` must be accurate** when `pageSize=1` (paged wrapper: `data.totalCount` or root `totalCount`).
2. **Places counts** must stay in sync with join-request / team assignment state:
   - `selectedJoinRequestsCount`
   - `assignedJoinRequestsCount`
   - `connectedTeamsCount`
3. **`getOnlyStates`**: one state per request is enough for global chips.
4. **Invalid filter states** (not in list enum): do not use in `getOnlyStates` until supported:
   - `ApprovedFromWaitingList`, `WithdrawnAfterApproval`, `WithdrawnFromWaitingList`

---

## Optional improvement (recommended)

Single summary endpoint to replace the **6** remaining list calls for chips:

```
GET /tournaments/{tournamentId}/tournament-team-join-requests/summary
```

Example response:

```json
{
  "pending": 8,
  "underReview": 0,
  "accepted": 0,
  "waitingList": 0,
  "canceled": 0,
  "noPreferenceWaiting": 8
}
```

Place rows already come from `GET /places`.
