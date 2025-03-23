import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Elysia, { t } from "elysia";

dayjs.extend(customParseFormat);
import { dataDB } from "@/models/meal";

const get = new Elysia().get(
  ":key/:date",
  async ({
    params: { key, date },
  }) => {
    const data = await dataDB.find({
      date: dayjs(date).format("YYYY-MM-DD"),
      type: key,
    });

    console.log(data);

    const timeFilter = (criteria: string) =>
      data.filter((v) => {
        console.log("raw values:", v.start, v.end);
        const start = dayjs(v.start, "HH:mm");
        const end = dayjs(v.end, "HH:mm");
        const include = dayjs(criteria, "HH:mm");
        console.log(start.format(), end.format(), include.format());
        return (start.isBefore(include) && end.isAfter(include)) || start.isSame(include) || end.isSame(include);
      }).map((v) => ({
        title: v.type,
        menu: v.menu,
        time: `${v.start} ~ ${v.end}`,
      }));

    const result = {
      breakfast: timeFilter("07:00"),
      lunch: timeFilter("12:00"),
      dinner: timeFilter("18:00"),
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
    },
  },
);

export default get;
