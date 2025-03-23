import Elysia from "elysia";

import info from "./info";
import list from "./list";
import meal from "./meal";

const MealRouter = new Elysia({
  name: "Meal Router",
  prefix: "meal",
})
  .use(meal)
  .use(info)
  .use(list);

export default MealRouter;
