export type DashboardUser = {
  id: string;
  phone: string;
  name: string;
  username: string;
  avatarUrl: string | null;
};

export type PlaceModerator = {
  user: DashboardUser;
};

export type PlaceModeratorCreate = {
  username: string;
};
