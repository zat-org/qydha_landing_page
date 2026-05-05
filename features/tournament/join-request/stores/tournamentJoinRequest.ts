import { defineStore } from "pinia";
import type { DetailTournament } from "~/features/tournament/models/tournament";
import {
  type SingleJoinRequest,
  type TournamentJoinRequest,
  TournamentJoinRequestType,
  TournamentJoinRequestState,
  type TeamJoinRequest,
  type AcceptedTeam,
  type AcceptedTeamFromSingle,
} from "~/features/tournament/models/TournamentJoinRequest";

export const useTournamentJoinRequestStore = defineStore(
  "tournamentJoinRequestStore",
  () => {
    const tournament = ref<DetailTournament>();
    const allrequest = ref<TournamentJoinRequest[]>([]);
    const acceptedTeams = ref<AcceptedTeam[]>([]);
    const acceptedSingles = ref<SingleJoinRequest[]>([]);

    const setTournament = (_tournament: DetailTournament) => {
      tournament.value = _tournament;
    };

    const setAllRequests = (requests: TournamentJoinRequest[]) => {
      allrequest.value = requests;
    };

    const canAddMore = () => {
      const expectedTeamsCount = tournament.value?.tournament.expectedTeamsCount;
      if (!expectedTeamsCount) return false;
      const acceptedTeamsCount = acceptedTeams.value.length;
      const acceptedSinglesCount = acceptedSingles.value.length;
      const currentCount =
        acceptedTeamsCount + Math.floor(acceptedSinglesCount / 2);
      return currentCount < expectedTeamsCount;
    };

    const canSubmit = () => {
      const expectedTeamsCount = tournament.value?.tournament.expectedTeamsCount;
      if (!expectedTeamsCount) return false;
      const acceptedTeamsCount = acceptedTeams.value.length;
      const acceptedSinglesCount = acceptedSingles.value.length;
      return (
        acceptedTeamsCount + Math.floor(acceptedSinglesCount / 2) ===
        expectedTeamsCount
      );
    };

    const AddAcceptedTeams = (
      _acceptedTeam: TeamJoinRequest | AcceptedTeamFromSingle
    ) => {
      if (!canAddMore()) return;
      switch ("originalType" in _acceptedTeam) {
        case true: {
          const fromSingle = _acceptedTeam as AcceptedTeamFromSingle;
          const merged = fromSingle.mergedFromIds;
          if (!merged) break;
          acceptedTeams.value = [...acceptedTeams.value, fromSingle];
          allrequest.value = allrequest.value.filter(
            (request) => request.id !== merged[0] && request.id !== merged[1]
          );
          break;
        }
        case false:
          allrequest.value = allrequest.value.filter(
            (request) => request.id !== _acceptedTeam.id
          );
          const acceptedTeam: AcceptedTeam = {
            id: _acceptedTeam.id,
            ownerId: _acceptedTeam.ownerId,
            ownerUserName: _acceptedTeam.ownerUserName,
            type: TournamentJoinRequestType.Team,
            teammateUserName: _acceptedTeam.teammateUserName,
            teammateId: _acceptedTeam.teammateId,
            teamName: _acceptedTeam.teamName,
            createdAt: _acceptedTeam.createdAt,
            state: TournamentJoinRequestState.Approved,
            originalType: TournamentJoinRequestType.Team,
          };
          acceptedTeams.value = [...acceptedTeams.value, acceptedTeam];
          break;
      }
    };
    const RemoveAcceptedTeams = (removedTeam: AcceptedTeam) => {
      acceptedTeams.value = acceptedTeams.value.filter(
        (team) => team.id !== removedTeam.id
      );
      console.log(acceptedTeams.value.length);
      switch (removedTeam.originalType) {
        case TournamentJoinRequestType.Team: {
          const returnedRequest: TeamJoinRequest = {
            id: removedTeam.id,
            ownerId: removedTeam.ownerId,
            ownerUserName: removedTeam.ownerUserName,
            type: TournamentJoinRequestType.Team,
            teammateUserName: removedTeam.teammateUserName,
            teammateId: removedTeam.teammateId,
            teamName: removedTeam.teamName,
            createdAt: removedTeam.createdAt,
            state: TournamentJoinRequestState.WaitingApproval,
          };
          allrequest.value = [...allrequest.value, returnedRequest];
          break;
        }
        case TournamentJoinRequestType.Single: {
          const mergedIds = removedTeam.mergedFromIds;
          if (!mergedIds) break;

          const originalSingle1: SingleJoinRequest = {
            id: mergedIds[0],
            ownerId: removedTeam.ownerId,
            ownerUserName: removedTeam.ownerUserName,
            type: TournamentJoinRequestType.Single,
            state: TournamentJoinRequestState.Approved,
            createdAt: removedTeam.createdAt,
          };
          const originalSingle2: SingleJoinRequest = {
            id: mergedIds[1],
            ownerId: removedTeam.teammateId,
            ownerUserName: removedTeam.teammateUserName,
            type: TournamentJoinRequestType.Single,
            state: TournamentJoinRequestState.WaitingApproval,
            createdAt: removedTeam.createdAt,
          };

          console.log(originalSingle1, originalSingle2);
          if (originalSingle1 && originalSingle2) {
            acceptedSingles.value = [
              ...acceptedSingles.value,
              originalSingle1,
              originalSingle2,
            ];
          }

          break;
        }
      }
    };

    const RemoveAcceptedSingles = (removedSingle: SingleJoinRequest) => {
      acceptedSingles.value = acceptedSingles.value.filter(
        (single) => single.id !== removedSingle.id
      );

      const returnedSingle: SingleJoinRequest = {
        ...removedSingle,
        state: TournamentJoinRequestState.WaitingApproval,
      };

      allrequest.value = [...allrequest.value, returnedSingle];
    };

    const AddAcceptedSingles = (_acceptedSingle: SingleJoinRequest) => {
      if (!canAddMore()) return;
      allrequest.value = allrequest.value.filter(
        (request) => request.id !== _acceptedSingle.id
      );
      const acceptedSingle = {
        ..._acceptedSingle,
        state: TournamentJoinRequestState.Approved,
      };
      acceptedSingles.value = [...acceptedSingles.value, acceptedSingle];
    };
    const getAcceptedSingleById = (id: string) => {
      return acceptedSingles.value.find((single) => single.id === id);
    };

    const getAcceptedTeamById = (id: string) => {
      return acceptedTeams.value.find((team) => team.id === id);
    };

    const mergeAcceptedSinglesToAcceptedTeam = (
      single1: SingleJoinRequest,
      single2: SingleJoinRequest
    ) => {
      acceptedSingles.value = acceptedSingles.value.filter(
        (single) => single.id !== single1.id && single.id !== single2.id
      );
      const mergedTeam: AcceptedTeam = {
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substr(2, 9),
        ownerId: single1.ownerId,
        ownerUserName: single1.ownerUserName,
        type: TournamentJoinRequestType.Team,
        teammateUserName: single2.ownerUserName,
        teammateId: single2.ownerId,
        teamName: `${single1.ownerUserName} & ${single2.ownerUserName}`,
        createdAt: new Date().toISOString(),
        state: TournamentJoinRequestState.Approved,
        originalType: TournamentJoinRequestType.Single,
        mergedFromIds: [single1.id, single2.id],
      };
      AddAcceptedTeams(mergedTeam);
    };

    const mergeAllSinglesRandomly = () => {
      const singles = [...acceptedSingles.value];
      const shuffled = [...singles].sort(() => Math.random() - 0.5);

      for (let i = 0; i < shuffled.length - 1; i += 2) {
        if (i + 1 < shuffled.length) {
          mergeAcceptedSinglesToAcceptedTeam(shuffled[i], shuffled[i + 1]);
        }
      }
    };

    const mergeSinglesToTeams = (
      singles: SingleJoinRequest[]
    ): AcceptedTeam[] => {
      const mergedTeams: AcceptedTeam[] = [];
      const shuffled = [...singles].sort(() => Math.random() - 0.5);

      for (let i = 0; i < shuffled.length - 1; i += 2) {
        if (i + 1 < shuffled.length) {
          const single1 = shuffled[i];
          const single2 = shuffled[i + 1];

          const mergedTeam: AcceptedTeam = {
            id: crypto.randomUUID
              ? crypto.randomUUID()
              : Math.random().toString(36).substr(2, 9),
            ownerId: single1.ownerId,
            ownerUserName: single1.ownerUserName,
            type: TournamentJoinRequestType.Team,
            teammateUserName: single2.ownerUserName,
            teammateId: single2.ownerId,
            teamName: `${single1.ownerUserName} & ${single2.ownerUserName}`,
            createdAt: new Date().toISOString(),
            state: TournamentJoinRequestState.WaitingApproval,
            originalType: TournamentJoinRequestType.Single,
            mergedFromIds: [single1.id, single2.id],
          };
          mergedTeams.push(mergedTeam);
        }
      }

      return mergedTeams;
    };

    const autoSelectTeams = () => {
      const expectedTeamsCount = tournament.value?.tournament.expectedTeamsCount;
      if (!expectedTeamsCount) return;

      const availableSingles = allrequest.value.filter(
        (req) => req.type === TournamentJoinRequestType.Single
      ) as SingleJoinRequest[];

      const mergedTeamsFromSingles: AcceptedTeam[] = [];
      if (availableSingles.length >= 2) {
        const merged = mergeSinglesToTeams(availableSingles);
        mergedTeamsFromSingles.push(...merged);
      }

      const availableTeamRequests = allrequest.value.filter(
        (req) => req.type === TournamentJoinRequestType.Team
      ) as TeamJoinRequest[];

      const allAvailableTeams: (AcceptedTeam | TeamJoinRequest)[] = [
        ...mergedTeamsFromSingles,
        ...availableTeamRequests,
      ];

      const currentCount =
        acceptedTeams.value.length +
        Math.floor(acceptedSingles.value.length / 2);
      const needed = expectedTeamsCount - currentCount;

      const shuffled = [...allAvailableTeams].sort(() => Math.random() - 0.5);
      const toAccept = shuffled.slice(0, Math.min(needed, shuffled.length));

      toAccept.forEach((team) => {
        if (canAddMore()) {
          if ("originalType" in team) {
            AddAcceptedTeams(team as AcceptedTeam);
          } else {
            AddAcceptedTeams(team as TeamJoinRequest);
          }
        }
      });
    };

    const autoCompleteRemaining = () => {
      if (acceptedSingles.value.length >= 2) {
        mergeAllSinglesRandomly();
      }

      autoSelectTeams();
    };

    const submitAcceptedTeams = (): AcceptedTeam[] => {
      return [...acceptedTeams.value];
    };

    const addDummyData = () => {
      const dummyRequests: TournamentJoinRequest[] = [];

      const arabicNames = [
        "أحمد محمد",
        "محمد علي",
        "خالد أحمد",
        "عمر حسن",
        "يوسف إبراهيم",
        "علي محمود",
        "حسن سعيد",
        "محمود خالد",
        "سعيد يوسف",
        "إبراهيم عمر",
        "فهد ناصر",
        "ناصر فهد",
        "طارق سامي",
        "سامي طارق",
        "وليد راشد",
        "راشد وليد",
        "بدر خالد",
        "خالد بدر",
        "سالم ماجد",
        "ماجد سالم",
        "عبدالله فهد",
        "فهد عبدالله",
        "عبدالرحمن نايف",
        "نايف عبدالرحمن",
        "عبدالعزيز سعد",
        "سعد عبدالعزيز",
        "فيصل خالد",
        "خالد فيصل",
        "مشعل نايف",
        "نايف مشعل",
      ];

      const teamNames = [
        "الفرسان",
        "الأبطال",
        "الأسود",
        "النسور",
        "الفهود",
        "الأساطير",
        "الملوك",
        "الأشبال",
        "البرق",
        "الرعد",
        "الغزاة",
        "المحاربون",
        "الفائزون",
        "المنتصرون",
        "الأقوياء",
      ];

      for (let i = 0; i < 30; i++) {
        const id = `dummy-${i + 1}`;
        const ownerId = `owner-${i + 1}`;
        const ownerUserName = arabicNames[i % arabicNames.length];
        const createdAt = new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString();
        const state = TournamentJoinRequestState.WaitingApproval;

        if (i % 5 < 3) {
          const singleRequest: SingleJoinRequest = {
            id,
            ownerId,
            ownerUserName,
            type: TournamentJoinRequestType.Single,
            state,
            createdAt,
          };
          dummyRequests.push(singleRequest);
        } else {
          const teammateIndex = (i + 1) % arabicNames.length;
          const teammateUserName = arabicNames[teammateIndex];
          const teamRequest: TeamJoinRequest = {
            id,
            ownerId,
            ownerUserName,
            type: TournamentJoinRequestType.Team,
            teammateUserName,
            teammateId: `teammate-${teammateIndex + 1}`,
            teamName: teamNames[i % teamNames.length],
            state,
            createdAt,
          };
          dummyRequests.push(teamRequest);
        }
      }
      console.log(allrequest.value.length);
      allrequest.value = [...dummyRequests];
    };

    return {
      addDummyData,
      allrequest,
      acceptedTeams,
      acceptedSingles,
      setTournament,
      setAllRequests,
      AddAcceptedTeams,
      RemoveAcceptedTeams,
      RemoveAcceptedSingles,
      AddAcceptedSingles,
      getAcceptedSingleById,
      getAcceptedTeamById,
      mergeAcceptedSinglesToAcceptedTeam,
      canAddMore,
      canSubmit,
      mergeAllSinglesRandomly,
      autoSelectTeams,
      autoCompleteRemaining,
      submitAcceptedTeams,
    };
  }
);
