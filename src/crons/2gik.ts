import cron, { CronConfig, Patterns } from "@elysiajs/cron";
import axios from "axios";

import { dataDB } from "@/models/meal";

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
          type: "2gik",
          date: menus[`fo_date${i}`],
          start: "07:00",
          end: "09:00",
        },
        {
          type: "2gik",
          date: menus[`fo_date${i}`],
          start: "07:00",
          end: "09:00",
          menu: menus[`fo_menu_mor${i}`].split(", "),
        },
        { upsert: true }
      ),
      dataDB.updateOne(
        { 
          type: "2gik",
          date: menus[`fo_date${i}`],
          start: "11:30",
          end: "13:30",
        },
        {
          type: "2gik",
          date: menus[`fo_date${i}`],
          start: "11:30",
          end: "13:30",
          menu: menus[`fo_menu_lun${i}`].split(", "),
        },
        { upsert: true }
      ),
      dataDB.updateOne(
        { 
          type: "2gik",
          date: menus[`fo_date${i}`],
          start: "17:00",
          end: "18:30",
        },
        {
          type: "2gik",
          date: menus[`fo_date${i}`],
          start: "17:00",
          end: "18:30",
          menu: menus[`fo_menu_eve${i}`].split(", "),
        },
        { upsert: true }
      ),
    );
  }

  await Promise.all(datas);
};

const Cron_2Gik = cron({
  name: "2gik",
  pattern: Patterns.EVERY_DAY_AT_10AM,
  run: run,
});

export default Cron_2Gik;
