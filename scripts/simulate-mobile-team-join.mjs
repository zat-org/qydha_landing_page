/**
 * API simulation of the mobile flow: login as player, POST team join request.
 *
 * Staging docs: https://qydha-api-staging.sam-baloot-admin.online/docs/
 * POST /auth/login
 * POST /tournaments/{tournamentId}/tournament-team-join-requests
 *
 * Pairs user1+user2, user3+user4, ... (captain creates, teammate accepts/rejects).
 * After teammate accept, state is WaitingOrganizerConsideration — manager can approve/refuse in the dashboard.
 * Each create may pick a place or leave preference empty (no place):
 * - JOIN_WITH_PLACE_RATIO (0..1, default 0.5): share of teams that select a place.
 * - With a place: random Qualification (else Final), or QUALIFICATION_PLACE_ID if set.
 * - Without: omits selectedQualificationsPlaceId (shows as "بدون تفضيل مكان").
 * Teams run in parallel (async concurrency, not OS threads):
 * - JOIN_CONCURRENCY: max teams in flight at once (default = all teams).
 * - JOIN_STAGGER_MS: delay between starting each team worker (eases login 429s).
 * - LOGIN_GAP_MS: wait inside a team before teammate login (after create).
 *
 * Run: npm run simulate:join
 * Requires .env: QydhaApiBase, QydhaToken, PLAYER_PASSWORD
 * Optional: ADMIN_USERNAME, ADMIN_PASSWORD (required when places must be listed)
 */

import crypto from "node:crypto";

const API_BASE = (process.env.QydhaApiBase || process.env.API_BASE || "").replace(/\/$/, "");
const APP_TOKEN = process.env.QydhaToken || "";
const PLAYER_PASSWORD = process.env.PLAYER_PASSWORD || "";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const TOURNAMENT_ID =
  process.env.TOURNAMENT_ID || "5349fd42-1044-48cb-b266-6e234d4a117c";
const USER_PREFIX = process.env.JOIN_USER_PREFIX || "user";
const USER_START = Number(process.env.JOIN_USER_START || 1);
const USER_END = Number(process.env.JOIN_USER_END || 16);
/** Optional: when a team selects a place, force this id instead of random. */
const PLACE_ID = process.env.QUALIFICATION_PLACE_ID || "";
/**
 * 0..1 share of teams that set selectedQualificationsPlaceId.
 * Rest omit place (no preference). Default 0.5.
 */
const JOIN_WITH_PLACE_RATIO = Math.min(
  1,
  Math.max(0, Number(process.env.JOIN_WITH_PLACE_RATIO ?? 0.5)),
);
/** Wait inside a team before teammate login (after captain create). */
const LOGIN_GAP_MS = Number(process.env.LOGIN_GAP_MS || 15_000);
const LOGIN_MAX_RETRIES = Number(process.env.LOGIN_MAX_RETRIES || 6);
/** teammate PATCH accept | reject — manager only sees the request after accept. */
const TEAMMATE_ACTION = (process.env.TEAMMATE_ACTION || "accept").toLowerCase();
/** all = create + teammate; create = captain only; teammate = accept/reject existing invites */
const JOIN_PHASE = (process.env.JOIN_PHASE || "all").toLowerCase();
/**
 * Max teams processed at the same time (Promise concurrency).
 * Default 0 = all teams in parallel.
 */
const JOIN_CONCURRENCY = Math.max(0, Number(process.env.JOIN_CONCURRENCY || 0));
/** Delay between launching each team worker (ms). Helps avoid login 429 storms. */
const JOIN_STAGGER_MS = Math.max(0, Number(process.env.JOIN_STAGGER_MS || 0));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryAfterMs(res, _json) {
  const header = res.headers.get("retry-after");
  if (header) {
    const seconds = Number(header);
    if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000;
  }
  return null;
}

function hmacHeaders() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const xInfo = JSON.stringify({});
  const secret = APP_TOKEN || "default-secret";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}:${xInfo}`)
    .digest("hex");
  return {
    "x-info": xInfo,
    "x-timestamp": timestamp,
    "x-signature": signature,
  };
}

async function api(path, { method = "GET", token, body } = {}) {
  const headers = {
    Accept: "application/json",
    ...hmacHeaders(),
    Authorization: `Bearer ${token || APP_TOKEN}`,
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json, retryAfterMs: retryAfterMs(res, json) };
}

function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}

/**
 * Load places eligible for join preference (Qualification if any, else Final).
 * Uses an admin JWT — players/app token often cannot list organizer places.
 */
async function loadJoinPlaces(adminJwt) {
  const { ok, status, json } = await api(`/tournaments/${TOURNAMENT_ID}/places`, {
    token: adminJwt,
  });
  if (!ok) {
    throw new Error(
      `fetch places failed (${status}): ${JSON.stringify(json)}`,
    );
  }
  const all = unwrapList(json);
  const qual = all.filter((p) => p.stageType === "Qualification" && p.id);
  const finalPlaces = all.filter((p) => p.stageType === "Final" && p.id);
  const places = qual.length > 0 ? qual : finalPlaces;
  return places.map((p) => ({
    id: p.id,
    label: p.locationDescription || p.id,
    stageType: p.stageType,
  }));
}

function pickRandomPlace(places) {
  if (!places.length) return null;
  return places[Math.floor(Math.random() * places.length)];
}

/** Some teams get a place; others return null (no selectedQualificationsPlaceId). */
function pickPlaceForTeam(places) {
  if (Math.random() >= JOIN_WITH_PLACE_RATIO) return null;
  if (PLACE_ID) {
    return (
      places.find((p) => p.id === PLACE_ID) || {
        id: PLACE_ID,
        label: PLACE_ID,
        stageType: "forced",
      }
    );
  }
  return pickRandomPlace(places);
}

function extractJwt(payload) {
  return (
    payload?.data?.jwtToken ||
    payload?.jwtToken ||
    payload?.data?.data?.jwtToken ||
    null
  );
}

async function loginWithPassword(username, password) {
  let lastError = "";
  for (let attempt = 1; attempt <= LOGIN_MAX_RETRIES; attempt += 1) {
    const { ok, status, json, retryAfterMs: waitHeader } = await api("/auth/login", {
      method: "POST",
      token: APP_TOKEN,
      body: { username, password },
    });
    if (ok) {
      const jwt = extractJwt(json);
      if (!jwt) {
        throw new Error(`no jwtToken in login response for ${username}`);
      }
      return jwt;
    }
    lastError = `login failed for ${username} (${status}): ${JSON.stringify(json)}`;
    const isRateLimit =
      status === 429 || json?.code === "RateLimitError";
    if (!isRateLimit || attempt === LOGIN_MAX_RETRIES) {
      throw new Error(lastError);
    }
    const waitMs = waitHeader ?? Math.min(60_000, 20_000 * attempt);
    console.log(
      `rate limited on login ${username} (attempt ${attempt}/${LOGIN_MAX_RETRIES}), waiting ${Math.round(waitMs / 1000)}s…`,
    );
    await sleep(waitMs);
  }
  throw new Error(lastError);
}

async function loginPlayer(username) {
  return loginWithPassword(username, PLAYER_PASSWORD);
}

async function loginAdmin() {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_USERNAME and ADMIN_PASSWORD are required to load places (or set QUALIFICATION_PLACE_ID).",
    );
  }
  return loginWithPassword(ADMIN_USERNAME, ADMIN_PASSWORD);
}

function isExistingTeamError(json, status) {
  const blob = JSON.stringify(json || {}).toLowerCase();
  return (
    status === 409 ||
    blob.includes("teamname") ||
    blob.includes("team name") ||
    blob.includes("already") ||
    blob.includes("exist") ||
    blob.includes("duplicate")
  );
}

function pagedItems(payload) {
  return (
    payload?.data?.items ||
    payload?.items ||
    payload?.data?.data?.items ||
    []
  );
}

function matchInvite(item, captainUsername) {
  const tournamentOk =
    !item.tournamentId ||
    String(item.tournamentId).toLowerCase() === TOURNAMENT_ID.toLowerCase();
  const creator = String(item.creatorUsername || "").toLowerCase();
  const waiting =
    item.state === "WaitingTeammateAcceptance" ||
    item.overallStatus === "PendingInvitation" ||
    item.overallStatus === "PendingTeammateAcceptance";
  return tournamentOk && waiting && creator === captainUsername.toLowerCase();
}

async function listMyJoinRequests(jwt) {
  const base = {
    TournamentId: TOURNAMENT_ID,
    OnlyReceivingOrManagingJoinRequestsTournaments: "true",
    PageNumber: "1",
    PageSize: "50",
  };
  let listed = await api(
    `/tournaments/tournament-team-join-requests/me?${new URLSearchParams({ ...base, Filter: "PendingInvitation" })}`,
    { token: jwt },
  );
  if (!listed.ok || pagedItems(listed.json).length === 0) {
    listed = await api(
      `/tournaments/tournament-team-join-requests/me?${new URLSearchParams(base)}`,
      { token: jwt },
    );
  }
  return listed;
}

async function teammateRespond(jwt, joinRequestId) {
  const action = TEAMMATE_ACTION === "reject" ? "reject" : "accept";
  return api(
    `/tournaments/${TOURNAMENT_ID}/tournament-team-join-requests/${joinRequestId}/${action}`,
    { method: "PATCH", token: jwt },
  );
}

async function teammateAcceptOrReject(captain, teammate) {
  console.log(`waiting ${LOGIN_GAP_MS}ms before teammate login (${teammate})…`);
  await sleep(LOGIN_GAP_MS);
  const jwt = await loginPlayer(teammate);
  const listed = await listMyJoinRequests(jwt);
  if (!listed.ok) {
    throw new Error(
      `list invites failed for ${teammate} (${listed.status}): ${JSON.stringify(listed.json)}`,
    );
  }
  const items = pagedItems(listed.json);
  const invite = items.find((item) => matchInvite(item, captain));
  if (!invite?.joinRequestId) {
    throw new Error(
      `no pending invite for ${teammate} from ${captain}. items=${JSON.stringify(items.map((i) => ({ id: i.joinRequestId, creator: i.creatorUsername, state: i.state, overall: i.overallStatus })))}`,
    );
  }
  const { ok, status, json } = await teammateRespond(jwt, invite.joinRequestId);
  if (!ok) {
    throw new Error(
      `teammate ${TEAMMATE_ACTION} failed (${status}): ${JSON.stringify(json)}`,
    );
  }
  return invite.joinRequestId;
}

async function createTeamJoin(captainJwt, teamName, teammateUserName, placeId) {
  const body = {
    type: "Team",
    teamName,
    teammateUserName,
    acceptsWaitingListPlacement: true,
  };
  if (placeId) body.selectedQualificationsPlaceId = placeId;

  return api(`/tournaments/${TOURNAMENT_ID}/tournament-team-join-requests`, {
    method: "POST",
    token: captainJwt,
    body,
  });
}

function usernames() {
  const list = [];
  for (let i = USER_START; i <= USER_END; i += 1) {
    list.push(`${USER_PREFIX}${i}`);
  }
  return list;
}

/** Run async workers with a max number in flight (Node async concurrency). */
async function runWithConcurrency(items, concurrency, worker) {
  const limit =
    !concurrency || concurrency <= 0 ? items.length : Math.min(concurrency, items.length);
  const results = new Array(items.length);
  let nextIndex = 0;
  const startedAt = Date.now();

  async function runOne() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      if (JOIN_STAGGER_MS > 0) {
        const wait = startedAt + index * JOIN_STAGGER_MS - Date.now();
        if (wait > 0) await sleep(wait);
      }
      results[index] = await worker(items[index], index);
    }
  }

  const runners = Array.from({ length: Math.max(1, limit) }, () => runOne());
  await Promise.all(runners);
  return results;
}

async function processTeam({ captain, teammate, place }) {
  const teamName = `Team ${captain}-${teammate}`;
  try {
    let createOk = JOIN_PHASE === "teammate";
    if (JOIN_PHASE !== "teammate") {
      const jwt = await loginPlayer(captain);
      const { ok, status, json } = await createTeamJoin(
        jwt,
        teamName,
        teammate,
        place?.id,
      );
      if (ok) {
        createOk = true;
        console.log(
          `CREATED ${teamName} (${status}) place=${place?.label ?? "none (no preference)"} — next: teammate ${TEAMMATE_ACTION}`,
        );
      } else if (isExistingTeamError(json, status)) {
        createOk = true;
        console.log(
          `SKIP create ${teamName} (${status}) team already exists — next: teammate ${TEAMMATE_ACTION}`,
        );
      } else {
        throw new Error(`create failed (${status}): ${JSON.stringify(json)}`);
      }
    } else {
      console.log(`SKIP create ${teamName} (JOIN_PHASE=teammate)`);
    }

    let joinRequestId = null;
    if (JOIN_PHASE !== "create") {
      joinRequestId = await teammateAcceptOrReject(captain, teammate);
      console.log(
        `TEAMMATE ${TEAMMATE_ACTION.toUpperCase()} ${teamName} id=${joinRequestId} — manager can now consider/approve or refuse`,
      );
    }

    return {
      teamName,
      captain,
      teammate,
      placeId: place?.id ?? null,
      placeLabel: place?.label ?? null,
      ok: createOk,
      joinRequestId,
    };
  } catch (err) {
    console.log(`FAIL ${teamName}: ${err instanceof Error ? err.message : err}`);
    return {
      teamName,
      captain,
      teammate,
      placeId: place?.id ?? null,
      placeLabel: place?.label ?? null,
      ok: false,
      status: 0,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

async function main() {
  const missing = [];
  if (!API_BASE) missing.push("QydhaApiBase");
  if (!APP_TOKEN) missing.push("QydhaToken");
  if (!PLAYER_PASSWORD) missing.push("PLAYER_PASSWORD");
  if (missing.length) {
    console.error(
      `Missing env: ${missing.join(", ")}. Add them to .env then run:\n  npm run simulate:join`,
    );
    process.exit(1);
  }

  const users = usernames();
  if (users.length % 2 !== 0) {
    console.error("Need an even number of users (team join requires a teammate).");
    process.exit(1);
  }

  let places = [];
  if (JOIN_WITH_PLACE_RATIO <= 0) {
    console.log(
      "JOIN_WITH_PLACE_RATIO=0 — all teams omit place preference.",
    );
  } else if (PLACE_ID) {
    places = [{ id: PLACE_ID, label: PLACE_ID, stageType: "forced" }];
    console.log(
      JOIN_WITH_PLACE_RATIO >= 1
        ? `All teams will use QUALIFICATION_PLACE_ID=${PLACE_ID}.`
        : `QUALIFICATION_PLACE_ID=${PLACE_ID}; ~${Math.round(JOIN_WITH_PLACE_RATIO * 100)}% select it, rest omit place.`,
    );
  } else {
    console.log(`Logging in admin ${ADMIN_USERNAME || "(missing ADMIN_USERNAME)"} to load places…`);
    const adminJwt = await loginAdmin();
    places = await loadJoinPlaces(adminJwt);
    if (!places.length) {
      console.error(
        "No Qualification/Final places on this tournament. Set QUALIFICATION_PLACE_ID, add places, or JOIN_WITH_PLACE_RATIO=0.",
      );
      process.exit(1);
    }
    console.log(
      `Places (${places.length}): ${places.map((p) => `${p.label} [${p.stageType}]`).join(", ")}`,
    );
    console.log(
      `~${Math.round(JOIN_WITH_PLACE_RATIO * 100)}% of teams select a random place; rest omit place preference.`,
    );
  }

  const teamJobs = [];
  for (let i = 0; i < users.length; i += 2) {
    teamJobs.push({
      captain: users[i],
      teammate: users[i + 1],
      place: pickPlaceForTeam(places),
    });
  }

  const concurrency =
    JOIN_CONCURRENCY > 0 ? JOIN_CONCURRENCY : teamJobs.length;

  console.log(`API ${API_BASE}`);
  console.log(`Tournament ${TOURNAMENT_ID}`);
  console.log(`Users ${users[0]} … ${users[users.length - 1]} (${teamJobs.length} teams)`);
  console.log(
    `Parallel: concurrency=${concurrency}/${teamJobs.length} teams` +
      (JOIN_STAGGER_MS > 0 ? `, stagger ${JOIN_STAGGER_MS}ms` : ""),
  );
  console.log(
    `Teammate login gap ${LOGIN_GAP_MS}ms (LOGIN_GAP_MS); raise JOIN_STAGGER_MS or lower JOIN_CONCURRENCY if 429`,
  );
  console.log(`Phase ${JOIN_PHASE}, teammate action ${TEAMMATE_ACTION}`);

  const results = await runWithConcurrency(teamJobs, concurrency, (job) =>
    processTeam(job),
  );

  const passed = results.filter((r) => r.ok).length;
  console.log(`\nDone: ${passed}/${results.length} teams (create and/or teammate ${TEAMMATE_ACTION}).`);
  if (passed < results.length) process.exit(1);
}

main();
