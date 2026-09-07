import type { TournamentStatistics } from "~/features/tournament/models/tournament";

const STAT_KEYS: (keyof TournamentStatistics["statistics"])[] = [
  "sra",
  "baloot",
  "khamsen",
  "me2a",
  "rob3ome2a",
  "ekak",
  "aklat",
  "moshtaraSunCount",
  "moshtaraHokmCount",
  "wonMoshtaraCount",
  "lostMoshtaraCount",
  "sunKaboot",
  "hokmKaboot",
  "playedSakkas",
  "winnedSakkas",
  "lostSakka",
];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function pickNumber(
  source: Record<string, unknown>,
  camel: string,
): number | undefined {
  const pascal = camel.charAt(0).toUpperCase() + camel.slice(1);
  const raw = source[camel] ?? source[pascal];
  if (raw === undefined || raw === null || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function normalizeTournamentStatistics(
  raw: unknown,
): TournamentStatistics {
  const root = asRecord(raw);
  const nested = asRecord(root.data);
  const body = Object.keys(nested).length ? { ...root, ...nested } : root;
  const statsBag = asRecord(body.statistics ?? body.Statistics);

  const statistics = {} as TournamentStatistics["statistics"];
  for (const key of STAT_KEYS) {
    statistics[key] = pickNumber(statsBag, key) ?? 0;
  }

  return {
    matchesCount: pickNumber(body, "matchesCount") ?? 0,
    totalGames: pickNumber(body, "totalGames") ?? 0,
    statistics,
  };
}

export function useTournamentStatistics(tournamentId: string) {
  const { $api } = useNuxtApp();

  return useAppApiData<TournamentStatistics>(
    appKeys.tournamentStatistics(tournamentId),
    async () => {
      const response = await $api(
        `/tournaments/${tournamentId}/statistics`,
      );
      const envelope = asRecord(response);
      const inner =
        envelope.data !== undefined && envelope.data !== null
          ? envelope.data
          : response;
      return {
        data: normalizeTournamentStatistics(inner),
        message:
          typeof envelope.message === "string" ? envelope.message : undefined,
      };
    },
  );
}
