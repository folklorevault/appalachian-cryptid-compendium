import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/api/newsletter",
      method: "POST",
    },
    {
      path: "/api/sightings",
      method: "POST",
    },
    {
      path: "/api/event-submissions",
      method: "POST",
    },
  ],
});
