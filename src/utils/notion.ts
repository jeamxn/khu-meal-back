import { Client } from "@notionhq/client";

export const client = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const databases = {
  restaurant: process.env.NOTION_DATABASE_ID_RESTAURANT ?? "",
  course: process.env.NOTION_DATABASE_ID_COURSE ?? "",
  menu: process.env.NOTION_DATABASE_ID_MENU ?? "",
};
