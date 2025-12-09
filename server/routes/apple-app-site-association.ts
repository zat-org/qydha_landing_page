export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/json');
  return {
    applinks: {
      apps: [],
      details: [
        {
          appID: "FWP98M426M.com.qydha",
          paths: [
            "/",
            "/authentication",
            "/tournaments/*",
            "/baloot-game",
            "/hand-game",
            "/notifications",
            "/profile/*",
            "/store/*",
            "!*"
          ]
        }
      ]
    },
    webcredentials: {
      apps: [
        "FWP98M426M.com.qydha"
      ]
    }
  };
});
