import Elysia from "elysia";

import { restaurantDB } from "@/models/restaurant";
import exit from "@/utils/error";

const getRestaurant = new Elysia()
  .resolve(async ({
    error,
    params,
  }) => {
    const { key } = params as any;
    const restaurant = await restaurantDB.findOne({
      key,
    });
    const restaurantId = restaurant?._id;
    if (!restaurantId) {
      return exit(error, "NOT_FOUNDED_KEY");
    }
    return {
      restaurant: {
        _id: restaurantId,
        key: restaurant.key,
        title: restaurant.title,
        images: restaurant.images,
      }
    };
  })
  .as("plugin");

export default getRestaurant;
