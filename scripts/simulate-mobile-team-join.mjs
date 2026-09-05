/**
 * API simulation of the mobile flow: login as player, POST team join request.
 *
 * Staging docs: https://qydha-api-staging.sam-baloot-admin.online/docs/
 * POST /auth/login
 * POST /tournaments/{tournamentId}/tournament-team-join-requests
 *
 * Pairs user1+user2, user3+user4, ... (captain creates, teammate accepts/rejects).
 * After teammate accept, state is WaitingOrganizerConsideration — manager can approve/refuse in the dashboard.
 *
 * Run: npm run simulate:join
 * Requires .env: QydhaApiBase, QydhaToken, PLAYER_PASSWORD
 */

import crypto from "node:crypto";

const API_BASE = (process.env.QydhaApiBase || process.env.API_BASE || "").replace(/\/$/, "");
const APP_TOKEN = process.env.QydhaToken || "";
const PLAYER_PASSWORD = process.env.PLAYER_PASSWORD || "";
const TOURNAMENT_ID =
  process.env.TOURNAMENT_ID || "61633519-605f-45b7-8684-9673be94ecb9";
const USER_PREFIX = process.env.JOIN_USER_PREFIX || "user";
const USER_START = Number(process.env.JOIN_USER_START || 1);
const USER_END = Number(process.env.JOIN_USER_END || 16);
const PLACE_ID = process.env.QUALIFICATION_PLACE_ID || "";
/** Wait between teams so /auth/login is not rate-limited (429). */
const LOGIN_GAP_MS = Number(process.env.LOGIN_GAP_MS || 15_000);
const LOGIN_MAX_RETRIES = Number(process.env.LOGIN_MAX_RETRIES || 6);
/** teammate PATCH accept | reject — manager only sees the request after accept. */
const TEAMMATE_ACTION = (process.env.TEAMMATE_ACTION || "accept").toLowerCase();
/** all = create + teammate; create = captain only; teammate = accept/reject existing invites */
const JOIN_PHASE = (process.env.JOIN_PHASE || "all").toLowerCase();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryAfterMs(res, json) {
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

function extractJwt(payload) {
  return (
    payload?.data?.jwtToken ||
    payload?.jwtToken ||
    payload?.data?.data?.jwtToken ||
    null
  );
}

async function loginPlayer(username) {
  let lastError = "";
  for (let attempt = 1; attempt <= LOGIN_MAX_RETRIES; attempt += 1) {
    const { ok, status, json, retryAfterMs: waitHeader } = await api("/auth/login", {
      method: "POST",
      token: APP_TOKEN,
      body: { username, password: PLAYER_PASSWORD },
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

async function createTeamJoin(captainJwt, teamName, teammateUserName) {
  const body = {
    type: "Team",
    teamName,
    teammateUserName,
    acceptsWaitingListPlacement: true,
  };
  if (PLACE_ID) body.selectedQualificationsPlaceId = PLACE_ID;

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

  console.log(`API ${API_BASE}`);
  console.log(`Tournament ${TOURNAMENT_ID}`);
  console.log(`Users ${users[0]} … ${users[users.length - 1]} (${users.length / 2} teams)`);
  console.log(`Login gap ${LOGIN_GAP_MS}ms (set LOGIN_GAP_MS in .env if still 429)`);
  console.log(`Phase ${JOIN_PHASE}, teammate action ${TEAMMATE_ACTION}`);

  const results = [];
  for (let i = 0; i < users.length; i += 2) {
    const captain = users[i];
    const teammate = users[i + 1];
    const teamName = `Team ${captain}-${teammate}`;
    if (i > 0) {
      console.log(`waiting ${LOGIN_GAP_MS}ms before next team…`);
      await sleep(LOGIN_GAP_MS);
    }
    try {
      let createOk = JOIN_PHASE === "teammate";
      if (JOIN_PHASE !== "teammate") {
        const jwt = await loginPlayer(captain);
        const { ok, status, json } = await createTeamJoin(jwt, teamName, teammate);
        if (ok) {
          createOk = true;
          console.log(`CREATED ${teamName} (${status}) — next: teammate ${TEAMMATE_ACTION}`);
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

      results.push({
        teamName,
        captain,
        teammate,
        ok: createOk,
        joinRequestId,
      });
    } catch (err) {
      results.push({
        teamName,
        captain,
        teammate,
        ok: false,
        status: 0,
        message: err instanceof Error ? err.message : String(err),
      });
      console.log(`FAIL ${teamName}: ${err instanceof Error ? err.message : err}`);
    }
  }

  const passed = results.filter((r) => r.ok).length;
  console.log(`\nDone: ${passed}/${results.length} teams (create and/or teammate ${TEAMMATE_ACTION}).`);
  if (passed < results.length) process.exit(1);
}

main();
