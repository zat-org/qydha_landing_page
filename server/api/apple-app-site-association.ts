export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/json');  
  return {
    webcredentials: {
      apps: [
        "FWP98M426M.com.qydha"
      ]
    }
  };
});
