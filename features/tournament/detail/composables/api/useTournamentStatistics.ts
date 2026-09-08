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
  const nestedStats = asRecord(body.statistics ?? body.Statistics);
  const statsBag = Object.keys(nestedStats).length ? nestedStats : body;

  const statistics = {} as TournamentStatistics["statistics"];
  const missingKeys: string[] = [];
  for (const key of STAT_KEYS) {
    const parsed = pickNumber(statsBag, key);
    if (parsed === undefined) missingKeys.push(key);
    statistics[key] = parsed ?? 0;
  }

  const normalized = {
    matchesCount: pickNumber(body, "matchesCount") ?? 0,
    totalGames: pickNumber(body, "totalGames") ?? 0,
    statistics,
  };

  console.log("[tournament-statistics] normalize", {
    rawType: typeof raw,
    bodyKeys: Object.keys(body),
    statsBagKeys: Object.keys(statsBag),
    missingKeys,
    normalized,
  });

  return normalized;
}

export function useTournamentStatistics(tournamentId: string) {
  const { $api } = useNuxtApp();

  return useAppApiData<TournamentStatistics>(
    appKeys.tournamentStatistics(tournamentId),
    async () => {
      const path = `/tournaments/${tournamentId}/statistics`;
      console.log("[tournament-statistics] request", { tournamentId, path });
      try {
        const response = await $api(path);
        const envelope = asRecord(response);
        const inner =
          envelope.data !== undefined && envelope.data !== null
            ? envelope.data
            : response;
        console.log("[tournament-statistics] network response", {
          tournamentId,
          path,
          response,
          usedInnerFromEnvelopeData:
            envelope.data !== undefined && envelope.data !== null,
          inner,
        });
        return {
          data: normalizeTournamentStatistics(inner),
          message:
            typeof envelope.message === "string" ? envelope.message : undefined,
        };
      } catch (error) {
        console.error("[tournament-statistics] network error", {
          tournamentId,
          path,
          error,
        });
        throw error;
      }
    },
  );
}
