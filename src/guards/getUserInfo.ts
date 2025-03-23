import Elysia from "elysia";

import exit from "@/utils/error";

import userService from "./userService";


const getUserInfo = new Elysia()
  .use(userService)
  .guard({
    isSignIn: true,
  })
  .resolve(async ({ cookie, user, error }) => {
    const access_token = cookie.access_token.value;
    if (!access_token) {
      return exit(error, "UNAUTHORIZED");
    }
    const verify = await user.verifyToken(access_token);
    if (!verify) {
      return exit(error, "UNAUTHORIZED");
    }
    const userSearch = await user.findById(verify.id);
    const { password, ...userInfo } = { ...userSearch?.toObject() };
    return {
      userInfo: {
        ...userInfo,
        id: userInfo._id?.toString(),
      },
    };
  })
  .as("plugin");

export default getUserInfo;
