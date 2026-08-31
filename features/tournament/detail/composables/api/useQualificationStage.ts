import type { GenerateQualificationBracketsPayload } from "~/features/tournament/models/group";
import { appKeys } from "~/composables/queryKeys";

export function useQualificationStage() {
  const { $api } = useNuxtApp();

  const generateBrackets = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (
      tourId: string,
      body: GenerateQualificationBracketsPayload,
    ) => {
      await execute(async () => {
        await $api(`/tournaments/${tourId}/qualification-stage/generate-brackets`, {
          method: "POST",
          body,
        });
        await refreshAppData(
          appKeys.tournament(tourId),
          appKeys.tournamentGroups(tourId),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const revertGeneratedBrackets = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (tourId: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tourId}/qualification-stage/revert-generated-brackets`,
          { method: "POST" },
        );
        await refreshAppData(
          appKeys.tournament(tourId),
          appKeys.tournamentGroups(tourId),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const confirmBrackets = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (tourId: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tourId}/qualification-stage/confirm-brackets`,
          { method: "POST" },
        );
        await refreshAppData(
          appKeys.tournament(tourId),
          appKeys.tournamentGroups(tourId),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const revertTeamLinking = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (tourId: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tourId}/qualification-stage/revert-team-linking`,
          { method: "POST" },
        );
        await refreshAppData(
          appKeys.tournament(tourId),
          appKeys.tournamentGroups(tourId),
          appKeys.tournamentTeams,
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const confirmResults = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (tourId: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tourId}/qualification-stage/confirm-results`,
          { method: "PATCH" },
        );
        await refreshAppData(
          appKeys.tournament(tourId),
          appKeys.tournamentGroups(tourId),
          appKeys.tournamentTeams,
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const startGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (tourId: string, groupId: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tourId}/qualification-stage/groups/${groupId}/start`,
          { method: "PATCH" },
        );
        await refreshAppData(
          appKeys.tournament(tourId),
          appKeys.tournamentGroups(tourId),
          appKeys.tournamentGroupDetails(tourId, groupId),
          appKeys.match("getRoundsGroupDetails", tourId, groupId),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const resetGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (tourId: string, groupId: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tourId}/qualification-stage/groups/${groupId}/reset`,
          { method: "PATCH" },
        );
        await refreshAppData(
          appKeys.tournament(tourId),
          appKeys.tournamentGroups(tourId),
          appKeys.tournamentGroupDetails(tourId, groupId),
          appKeys.match("getRoundsGroupDetails", tourId, groupId),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const finishGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (tourId: string, groupId: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tourId}/qualification-stage/groups/${groupId}/finish`,
          { method: "PATCH" },
        );
        await refreshAppData(
          appKeys.tournament(tourId),
          appKeys.tournamentGroups(tourId),
          appKeys.tournamentGroupDetails(tourId, groupId),
          appKeys.match("getRoundsGroupDetails", tourId, groupId),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const resumeGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (tourId: string, groupId: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tourId}/qualification-stage/groups/${groupId}/resume`,
          { method: "PATCH" },
        );
        await refreshAppData(
          appKeys.tournament(tourId),
          appKeys.tournamentGroups(tourId),
          appKeys.tournamentGroupDetails(tourId, groupId),
          appKeys.match("getRoundsGroupDetails", tourId, groupId),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  return {
    generateBrackets,
    revertGeneratedBrackets,
    confirmBrackets,
    revertTeamLinking,
    confirmResults,
    startGroup,
    resetGroup,
    finishGroup,
    resumeGroup,
  };
}
