import Elysia from "elysia";

import info from "./info";
import meal from "./meal";

const MealRouter = new Elysia({
  name: "Meal Router",
  prefix: "meal",
})
  .use(meal)
  .use(info);

export default MealRouter;
