import Elysia from "elysia";

import Cron_2Gik from "./2gik";
import Cron_notion from "./notion";

const Crons = new Elysia({
  name: "crons",
})
  .use(Cron_2Gik)
  .use(Cron_notion);

export default Crons;
