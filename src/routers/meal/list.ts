import Elysia, { t } from "elysia";

import { restaurantDB } from "@/models/restaurant";

const list = new Elysia().get(
  "list",
  async () => {
    const restaurants = await restaurantDB.find();
    return restaurants.map((restaurant) => ({
      key: restaurant.key,
      title: restaurant.title,
      images: restaurant.images,
    }));
  },
  {
    response: {
      200: t.Array(
        t.Object({
          key: t.String(),
          title: t.String(),
          images: t.Array(t.String()),
        })
      ),
    },
  },
);

export default list;
