import cron, { CronConfig, Patterns } from "@elysiajs/cron";
import axios from "axios";
import mongoose from "mongoose";

import { dataDB } from "@/models/data";

const run: CronConfig["run"] = async () => { 
  const response = await axios.post(
    "https://dorm2.khu.ac.kr/food/getWeeklyMenu.do",
    new URLSearchParams({
      "locgbn": "K1",
      "sch_date": "",
      "fo_gbn": "stu"
    })
  );
  
  const menus = response.data.root[0].WEEKLYMENU[0];
  const datas = [];

  for (let i = 1; i <= 7; i++) {
    datas.push(
      dataDB.updateOne(
        { 
          course: new mongoose.Types.ObjectId("67df8f651ebc907021326750"),
          date: menus[`fo_date${i}`],
        },
        {
          menu: menus[`fo_menu_mor${i}`].split(", "),
        },
        { upsert: true }
      ),
      dataDB.updateOne(
        { 
          course: new mongoose.Types.ObjectId("67df90831ebc907021326755"),
          date: menus[`fo_date${i}`],
        },
        {
          menu: menus[`fo_menu_lun${i}`].split(", "),
        },
        { upsert: true }
      ),
      dataDB.updateOne(
        { 
          course: new mongoose.Types.ObjectId("67df908b1ebc907021326756"),
          date: menus[`fo_date${i}`],
        },
        {
          menu: menus[`fo_menu_eve${i}`].split(", "),
        },
        { upsert: true }
      ),
    );
  }

  await Promise.all(datas);

  console.log("💩 2gik done");
};

const Cron_2Gik = cron({
  name: "2gik",
  pattern: "0 0 * * *",
  run: run,
});

export default Cron_2Gik;
