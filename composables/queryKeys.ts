/** Stable useAsyncData cache keys. Use with refreshAppData(...). */
export const appKeys = {
  categories: "getAllcategory",
  tournament: (id: string) => `getSingelTournament-${id}`,
  book: "getBook",
  popup: "getPopup",
  banners: "getBanners",
  promoCodes: "getPromoCodes",
  groupCodes: "getGroupCodes",
  influencerCodes: "getinfluncerCodes",
  serviceAccounts: "getServiceAccounts",
  getPermissions: "getPermissions",
  getAccountToken: "getAccountToken",
  boardSettings: "updateBoardSettings",
  notifications: "getNotifications",
  marketing: "getMarketing",
  tables: "getTables",
  refrees: "getRefrees",
  users: "getUsers",
  getAllUsers: "getAllUsers",
  getSingleUser: "getSingleUser",
  getMeUser: "getMeUser",
  getUserRoles: "getUserRoles",
  leagues: "getLeagues",
  tournamentTables: (id: string, placeId: string) =>
    `getTable-${id}-${placeId}`,
  tournamentPlaces: (id: string) => `getPlaces-${id}`,
  tournamentTeams: "getAllTourTeams",
  tournamentNotInGroupTeams: "getNotInGroupTourTeams",
  tournamentGroups: (
    id: string,
    filters?: { stageId?: string; placeId?: string },
  ) => {
    const parts = [`getGroups-${id}`];
    if (filters?.stageId) parts.push(`stage-${filters.stageId}`);
    if (filters?.placeId) parts.push(`place-${filters.placeId}`);
    return parts.join("-");
  },
  tournamentGroupDetails: (tourId: string, groupId: string) =>
    `getGroupDetails-${tourId}-${groupId}`,
  tournamentReferees: (id: string, placeId: string) =>
    `getTournamentRefree-${id}-${placeId}`,
  tournamentModerators: "getAllmoderators",
  tournamentPlayers: "getPlayer",
  tournamentJoinRequests: "getTournamentJoinRequests",
  tournamentAcceptedTeams: "getTournamnetAcceptedTeamsJoinRequest",
  tournamentAcceptedSingles: "getTournamnetAcceptedSingleJoinRequest",
  tournamentStatistics: (id: string) => `getTournamentStatistics-${id}`,
  allTournaments: "getAllTournament",
  adminTourRequests: "AdminTourReqests",
  organizerTourRequests: "OrganizerTourReqests",
  adminSingleTourRequest: (id: string) =>
    `AdminGetSingleTournamentRequest-${id}`,
  match: (...parts: string[]) => ["match", ...parts].join("-"),
};
