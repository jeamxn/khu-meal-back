import Elysia, { t } from "elysia";

import getRestaurant from "@/guards/getRestaurant";
import { errorElysia } from "@/utils/error";

const info = new Elysia().use(getRestaurant).get(
  ":key",
  async ({
    restaurant,
  }) => {
    return {
      key: restaurant.key,
      title: restaurant.title,
      images: restaurant.images,
    };
  },
  {
    response: {
      200: t.Object({
        key: t.String(),
        title: t.String(),
        images: t.Array(t.String()),
      }),
      ...errorElysia(["NOT_FOUNDED_KEY"]),
    },
  },
);

export default info;
