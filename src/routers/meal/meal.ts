import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Elysia, { t } from "elysia";

dayjs.extend(customParseFormat);

import getRestaurant from "@/guards/getRestaurant";
import { dataDB } from "@/models/data";
import { errorElysia } from "@/utils/error";

const meal = new Elysia().use(getRestaurant).get(
  ":key/:date",
  async ({
    params: { key, date },
  }) => {
    const data = await dataDB.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $lookup: {
          from: "restaurants",
          localField: "course.restaurant",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      { $unwind: "$restaurant" },
      {
        $match: {
          "restaurant.key": key,
          date: dayjs(date).format("YYYY-MM-DD"),
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          date: 0,
          restaurant: 0,
        },
      },
    ]);

    const mapper = (v: any) => ({
      title: v.course.title,
      menu: v.menu,
      time: `${v.course.start} ~ ${v.course.end}`,
    });

    const result = {
      breakfast: data.filter((v) => {
        const start = dayjs(v.course.start, "HH:mm");
        const include = dayjs("11:00", "HH:mm");
        return start.isBefore(include);
      }).map(mapper).sort((a, b) => a.title > b.title ? 1 : -1),
      lunch: data.filter((v) => {
        const start = dayjs(v.course.start, "HH:mm");
        const end = dayjs(v.course.end, "HH:mm");
        const include = dayjs("12:00", "HH:mm");
        return (start.isBefore(include) && end.isAfter(include)) || start.isSame(include) || end.isSame(include);
      }).map(mapper).sort((a, b) => a.title > b.title ? 1 : -1),
      dinner: data.filter((v) => {
        const end = dayjs(v.course.end, "HH:mm");
        const include = dayjs("14:00", "HH:mm");
        return end.isAfter(include);
      }).map(mapper).sort((a, b) => a.title > b.title ? 1 : -1),
    };

    return result;
  },
  {
    response: {
      200: t.Object({
        breakfast: t.Array(
          t.Object({
            title: t.String(),
            menu: t.Array(t.String()),
            time: t.String(),
          }),
        ),
        lunch: t.Array(
          t.Object({
            title: t.String(),
            menu: t.Array(t.String()),
            time: t.String(),
          }),
        ),
        dinner: t.Array(
          t.Object({
            title: t.String(),
            menu: t.Array(t.String()),
            time: t.String(),
          }),
        ),
      }),
      ...errorElysia(["NOT_FOUNDED_KEY"]),
    },
  },
);

export default meal;
