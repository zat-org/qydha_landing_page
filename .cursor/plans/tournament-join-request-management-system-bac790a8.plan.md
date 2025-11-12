<!-- bac790a8-77e7-48fb-b351-a8a6bc24f57c c61cab79-c084-4c0d-9465-68093317fa62 -->
# Tournament Join Request Management System

## Overview

Enhance the existing `components/Tournament/JoiningRequest/index.vue` component to add a complete team selection and management system with three modes: Manual, Auto, and Hybrid. The system will manage two lists (accepted single requests and accepted teams) with merging capabilities and validation against expected team count.

## Key Features

1. **Three Management Modes**: Manual, Auto, Hybrid
2. **Two Lists**: Accepted Single Requests, Accepted Teams
3. **Merge Functionality**: Auto (random) and Manual (dropdown selection)
4. **Validation**: Ensure total accepted teams + (accepted singles / 2) = expectedTeamsCount
5. **Cancel Functionality**: Remove accepted teams/singles and restore original state
6. **Submit**: Send accepted teams (as TournamentJoinRequest[]) to backend

## Implementation Details

### Files to Modify

- `components/Tournament/JoiningRequest/index.vue` - Main component with full UI and logic
- `composables/TournamentJoinRequest.ts` - Add submit method for accepted teams
- `models/TournamentJoinRequest.ts` - Add interface for accepted team (extending TournamentJoinRequest)

### New Types/Interfaces

1. **AcceptedTeam** - Extends `TournamentJoinRequest` with metadata:

   - `originalType`: 'Team' | 'Single' (to track if from team request or merged single)
   - `mergedFromIds`: string[] (for teams created from singles)

### Component Structure

1. **Mode Selection**: Radio buttons or tabs for Manual/Auto/Hybrid
2. **Accepted Lists Section**:

   - List of accepted single requests with actions
   - List of accepted teams with actions
   - Display current count vs expected count

3. **Actions**:

   - Accept button (for team and single requests)
   - Cancel button (for accepted items)
   - Merge button (with auto/manual options)
   - Generate Teams button (auto merge all singles)
   - Submit button (disabled until count matches)

### Core Logic

#### Manual Mode

- User manually accepts team requests → moves to accepted teams list
- User manually accepts single requests → moves to accepted singles list
- User can merge singles (auto or manual selection)
- User submits when ready

#### Auto Mode

- Auto-merge all single requests into teams (randomly pair)
- Auto-select random teams from available (team requests + merged teams) to reach expected count
- User reviews and submits

#### Hybrid Mode

- User can manually accept teams and singles
- User can manually merge some singles
- System auto-merges remaining singles and auto-selects needed teams to complete count
- User submits

#### Validation Formula

```
acceptedTeamsCount + Math.floor(acceptedSinglesCount / 2) === expectedTeamsCount
```

#### Cancel Behavior

- Remove from accepted list
- Restore original state (keep as Approved but remove from accepted arrays)

### State Management

- `acceptedSingleRequests`: `TournamentJoinRequest[]`
- `acceptedTeams`: `TournamentJoinRequest[]` (modified to have team structure)
- `selectedMode`: 'manual' | 'auto' | 'hybrid'
- `isMerging`: boolean (for merge operation state)

### API Integration

- Add `submitAcceptedTeams` method in `composables/TournamentJoinRequest.ts`:
  - Takes `tournamentId` and `acceptedTeams: TournamentJoinRequest[]`
  - Sends POST request to backend endpoint (to be determined)
  - Returns success/error status

### UI Components Needed

1. Mode selector (tabs or radio group)
2. Two card sections for accepted lists
3. Action buttons (Accept, Cancel, Merge, Generate Teams, Submit)
4. Count display (current vs expected)
5. Merge modal/dialog with:

   - Auto merge option
   - Manual merge option (with dropdown for selecting partner)

6. Validation alerts when count doesn't match

### Utility Functions

- `mergeSinglesRandomly(singles: TournamentJoinRequest[]): TournamentJoinRequest[]`
- `mergeSinglesManually(single1: TournamentJoinRequest, single2: TournamentJoinRequest): TournamentJoinRequest`
- `canAcceptMore(): boolean` - Check if accepting would exceed expected count
- `validateCount(): boolean` - Check if current count matches expected
- `getTeamNameFromUsernames(ownerUserName: string, teammateUserName: string): string`

## Implementation Steps

1. **Update Models**: Add AcceptedTeam interface extending TournamentJoinRequest
2. **Update Composables**: Add submitAcceptedTeams method
3. **Refactor Component**: 

   - Add mode selection UI
   - Add state management for accepted lists
   - Implement accept/cancel logic
   - Implement merge logic (auto/manual)
   - Implement auto mode logic
   - Implement hybrid mode logic
   - Add validation and count display
   - Add submit functionality

4. **UI Enhancements**: Style lists, add action buttons, modals for merge operations
5. **Testing**: Verify all modes work correctly with different scenarios

### To-dos

- [ ] Add AcceptedTeam interface extending TournamentJoinRequest with originalType and mergedFromIds fields
- [ ] Add submitAcceptedTeams method in TournamentJoinRequest composable to send accepted teams to backend
- [ ] Add mode selection UI (Manual/Auto/Hybrid) with tabs or radio buttons in component
- [ ] Add reactive state for acceptedSingleRequests, acceptedTeams, selectedMode, and validation computed properties
- [ ] Implement accept functionality for team and single requests that moves items to accepted lists
- [ ] Implement cancel functionality that removes items from accepted lists and restores original state
- [ ] Implement merge logic with auto (random) and manual (dropdown selection) options for pairing singles
- [ ] Implement auto mode that merges all singles and randomly selects teams to reach expected count
- [ ] Implement hybrid mode that allows manual operations and auto-completes remaining teams
- [ ] Add validation UI showing current count vs expected count and enable/disable submit button
- [ ] Add submit button that calls submitAcceptedTeams API with accepted teams array
- [ ] Style all UI components (lists, buttons, modals) with proper RTL support and responsive design