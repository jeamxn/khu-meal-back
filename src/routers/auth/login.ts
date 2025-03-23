import Bun from "bun";
import Elysia, { t } from "elysia";

import User from "@/models/user";
import exit, { errorElysia } from "@/utils/error";

const login = new Elysia().use(User).post(
  "login",
  async ({ body, user, cookie, error }) => {
    const find = await user.findByUsername(body.username);
    if (!find) return exit(error, "USER_NOT_FOUND");
    const isValid = await Bun.password.verify(body.password, find.password);
    if (!isValid) return exit(error, "INVALID_PASSWORD");

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
    body: "user",
    response: {
      200: t.Object({
        success: t.Boolean(),
      }),
      ...errorElysia(["USER_NOT_FOUND", "INVALID_PASSWORD"]),
    },
  },
);

export default login;
