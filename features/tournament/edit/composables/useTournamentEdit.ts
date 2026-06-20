import type { TournamentUpdate } from "~/features/tournament/models/tournament";

function buildUpdateFormData(body: TournamentUpdate) {
  const formData = new FormData();
  formData.append("title", body.title);
  formData.append("description", body.description);
  formData.append("contactPhone", body.contactPhone);
  formData.append("startAt", body.startAt);
  formData.append("endAt", body.endAt);
  formData.append("type", body.tournamentType);
  formData.append("locationDescription", body.locationDescription);
  formData.append("isContactPhoneCall", String(body.isContactPhoneCall));
  formData.append("isContactPhoneWhatsapp", String(body.isContactPhoneWhatsapp));
  formData.append("teamsCount", String(body.teamsCount));
  formData.append("tablesCount", String(body.tablesCount));

  if (body.tournamentPrivatePassword) {
    formData.append("tournamentPrivatePassword", body.tournamentPrivatePassword);
  }

  formData.append("location", JSON.stringify(body.location));
  if (body.logo) formData.append("logo", body.logo);

  formData.append(
    "remainingSponsorsUrls",
    JSON.stringify(body.remainingSponsorsUrls),
  );
  body.sponsors.forEach((sponsor, index) => {
    formData.append(`sponsors[${index}]`, sponsor);
  });
  formData.append("prizes", JSON.stringify(body.prizes));
  formData.append("ownerId", body.ownerId);
  formData.append("rules", body.rules.length > 0 ? JSON.stringify(body.rules) : "[]");

  return formData;
}

export function useTournamentEdit(tournamentId: string) {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (body: TournamentUpdate) => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}`, {
        method: "PUT",
        body: buildUpdateFormData(body),
      });
      refreshNuxtData(`getSingelTournament-${tournamentId}`);
    });
  };

  return { pending, status, error, fetchREQ };
}
