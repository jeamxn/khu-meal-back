import Elysia from "elysia";

import Cron_2Gik from "./2gik";

const Crons = new Elysia({
  name: "crons",
})
  .use(Cron_2Gik);

export default Crons;
