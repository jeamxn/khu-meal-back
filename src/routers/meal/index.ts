import Elysia from "elysia";

import get from "./get";

const MealRouter = new Elysia({
  name: "Meal Router",
  prefix: "meal",
})
  .use(get);

export default MealRouter;
