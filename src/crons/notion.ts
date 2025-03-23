import cron, { CronConfig, Patterns } from "@elysiajs/cron";
import dayjs from "dayjs";

import { courseDB } from "@/models/course";
import { dataDB } from "@/models/data";
import { restaurantDB } from "@/models/restaurant";
import { client, databases } from "@/utils/notion";

const run: CronConfig["run"] = async () => {
  // 식당 목록 동기화
  const restaurants_notion = await client.databases.query({
    database_id: databases.restaurant,
  });
  const restaurants: {
    [key: string]: string;
  } = {};
  restaurants_notion.results.forEach((v: any) => {
    const p = v.properties;
    const id = v.id;
    const data = {
      key: p.KEY.title[0].plain_text,
      title: p["식당명"].rich_text[0].plain_text,
      images: [
        p["아침"].rich_text[0].plain_text,
        p["점심"].rich_text[0].plain_text,
        p["저녁"].rich_text[0].plain_text
      ]
    };
    restaurants[id] = p.KEY.title[0].plain_text;
    return restaurantDB.updateOne(
      { key: data.key },
      data,
      { upsert: true }
    );
  });

  // 식당 요리 코스 동기화
  const courses_notion = await client.databases.query({
    database_id: databases.course,
  });
  const courses: {
    [key: string]: string;
  } = {};
  courses_notion.results.forEach(async (v: any) => {
    const p = v.properties;
    const id = v.id;
    const restaurant_key = restaurants[p["식당"].relation[0].id];
    const restaurant = await restaurantDB.findOne({ key: restaurant_key });
    if (!restaurant?._id) {
      return;
    }
    courses[id] = p.KEY.title[0].plain_text;
    const data = {
      key: p.KEY.title[0].plain_text,
      title: p["코스명"].rich_text[0].plain_text,
      start: p["시작시간"].rich_text[0].plain_text,
      end: p["종료시간"].rich_text[0].plain_text,
      restaurant: restaurant._id,
    };
    return courseDB.updateOne(
      { key: data.key },
      data,
      { upsert: true }
    );
  });

  //식당 메뉴 동기화
  const menus_notion = await client.databases.query({
    database_id: databases.menu,
  });
  menus_notion.results.forEach(async (v: any) => {
    const p = v.properties;
    const course_key = courses[p["코스"].relation[0].id];
    const course = await courseDB.findOne({ key: course_key });
    if (!course?._id) {
      return;
    }
    const data = {
      course: course._id,
      date: p["날짜"].title[0].plain_text,
      menu: p["식단"].rich_text[0].plain_text.split(","),
    };
    return dataDB.updateOne(
      { course: course._id, date: data.date },
      data,
      { upsert: true }
    );
  });
  console.log("🐩 Notion done at:", dayjs().format("YYYY-MM-DD HH:mm:ss"));
};

const Cron_notion = cron({
  name: "cron_notion",
  pattern: Patterns.EVERY_10_HOURS,
  run: run,
});

export default Cron_notion;
