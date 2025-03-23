import Elysia, { t } from "elysia";

import getUserInfo from "@/guards/getUserInfo";
import { Me } from "@/utils/responses";

const me = new Elysia().use(getUserInfo).get(
  "me",
  async ({ userInfo }): Promise<Me> => {
    return {
      id: userInfo.id,
      username: userInfo.username,
    };
  },
  {
    response: {
      200: t.Object({
        id: t.String(),
        username: t.String(),
      }),
    },
  },
);

export default me;
