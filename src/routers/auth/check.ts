import Elysia, { t } from "elysia";

import User from "@/models/user";
import exit, { errorElysia } from "@/utils/error";

const check = new Elysia().use(User).post(
  "check",
  async ({ body, user, error }) => {
    const { refresh_token } = body;
    if (!refresh_token) return exit(error, "NO_REFRESH_TOKEN");
    const verify = await user.verifyToken(refresh_token);
    if (!verify) return exit(error, "UNAUTHORIZED");
    return {
      success: true,
    };
  },
  {
    body: t.Object({
      refresh_token: t.String(),
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
      }),
      ...errorElysia(["NO_REFRESH_TOKEN", "UNAUTHORIZED"]),
    },
  },
);

export default check;
