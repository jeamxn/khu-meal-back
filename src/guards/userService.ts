import { Elysia } from "elysia";

import User from "@/models/user";
import exit from "@/utils/error";

const userService = new Elysia({ name: "user/service" })
  .state({
    user: {} as Record<string, string>,
    session: {} as Record<number, string>,
  })
  .model({})
  .use(User)
  .macro({
    isSignIn: (enabled: boolean) => {
      if (!enabled) return;
      return {
        beforeHandle: async ({ cookie, user, error }) => {
          const access_token = cookie.access_token.value;
          const verify = await user.verifyToken(access_token ?? "");
          if (!verify) {
            const refresh_token = cookie.refresh_token.value;
            if (!refresh_token) return exit(error, "UNAUTHORIZED");
            const verifyR = await user.verifyToken(refresh_token);
            if (!verifyR) return exit(error, "UNAUTHORIZED");
            const find = await user.findById(verifyR.id);
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
          }
        },
      };
    },
  });

export default userService;
