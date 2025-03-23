import Elysia, { t } from "elysia";

import User from "@/models/user";
import exit, { errorElysia } from "@/utils/error";

const refresh = new Elysia().use(User).post(
  "refresh",
  async ({ cookie, user, error }) => {
    const refresh_token = cookie.refresh_token.value;
    if (!refresh_token) return exit(error, "NO_REFRESH_TOKEN");
    const verify = await user.verifyToken(refresh_token);
    if (!verify) return exit(error, "UNAUTHORIZED");

    const find = await user.findById(verify.id);
    if (!find) return exit(error, "UNAUTHORIZED");

    const refresh = await user.generateToken(find, "refresh");
    const access = await user.generateToken(find, "access");

    cookie.refresh_token.set({
      value: refresh,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "none",
      secure: true,
    });

    cookie.access_token.set({
      value: access,
      httpOnly: true,
      maxAge: 60 * 15,
      path: "/",
      sameSite: "none",
      secure: true,
    });

    return {
      success: true,
    };
  },
  {
    response: {
      200: t.Object({
        success: t.Boolean(),
      }),
      ...errorElysia(["NO_REFRESH_TOKEN", "UNAUTHORIZED"]),
    },
  },
);

export default refresh;
