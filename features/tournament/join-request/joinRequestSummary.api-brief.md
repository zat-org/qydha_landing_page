# Join-request dashboard summary — backend API brief

Frontend: `useTournamentLifecycleSummary` / `JoinRequestsLifecycleSummary.vue`

## Current approach (no full list fetch)

All summary calls use the **existing** organizer list endpoint with `pageSize=1` and read **`totalCount`** only:

```
GET /tournaments/{tournamentId}/tournament-team-join-requests
```

### Global chips (5 calls)

| UI chip | Query |
|---------|--------|
| قيد المراجعة | `getOnlyStates=WaitingOrganizerConsideration` |
| بانتظار الموافقة | `getOnlyStates=WaitingOrganizerApproval` |
| مقبولة | `getOnlyStates=ApprovedByOrganizer` |
| قائمة الانتظار | `getOnlyStates=InWaitingList` |
| ملغاة | `getOnlyStates=CanceledByOrganizer` |

**Total requests** = sum of the five states above (organizer-visible pipeline).

### Per qualification place (2 calls × N places)

For each place `P`:

| UI label | Query |
|----------|--------|
| **اختاروا** (player preferred) | `getOnlyStates=WaitingOrganizerConsideration` + `useSelectedQualificationsPlaceIdFilter=true` + `selectedQualificationsPlaceId={P}` |
| **معيّنة** (system assigned) | `getOnlyStates=WaitingOrganizerApproval` + `assignedPlaceId={P}` |

### No place preference (1 call)

| UI | Query |
|----|--------|
| بدون تفضيل مكان | `getOnlyStates=WaitingOrganizerConsideration` + `useSelectedQualificationsPlaceIdFilter=true` + `selectedQualificationsPlaceId=` (empty / null) |

### Place capacity

From existing places API (not join-requests):

```
GET /tournaments/{tournamentId}/places
```

Use `competingTeamsCount` per place as **السعة**.

---

## Required backend behaviour

1. **`totalCount` must be accurate** when `pageSize=1` (paged wrapper: `data.totalCount` or root `totalCount`).
2. **Place filters must work on staging** (organizer list already documents these params):
   - `useSelectedQualificationsPlaceIdFilter` + `selectedQualificationsPlaceId`
   - `assignedPlaceId`
3. **`getOnlyStates`**: one state per request is enough; **do not** require multi-state arrays for summary (multi-state list currently returns 400 on staging).
4. **Invalid filter states** (not in list enum): do not use in `getOnlyStates` until supported:
   - `ApprovedFromWaitingList`, `WithdrawnAfterApproval`, `WithdrawnFromWaitingList`

---

## Optional improvement (recommended)

Single summary endpoint to replace **6 + 2N** list calls:

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
  "noPreferenceWaiting": 8,
  "places": [
    {
      "placeId": "...",
      "choseCount": 0,
      "assignedCount": 0,
      "capacity": 4
    }
  ]
}
```

Frontend can switch to this when available and drop parallel count fan-out.
