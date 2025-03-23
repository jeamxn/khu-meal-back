import Elysia, { t } from "elysia";

const logout = new Elysia().post(
  "logout",
  async ({ cookie }) => {
    cookie.refresh_token.set({
      value: "refresh",
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "none",
      secure: true,
    });
    cookie.access_token.set({
      value: "access",
      httpOnly: true,
      maxAge: 0,
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
    },
  },
);

export default logout;
