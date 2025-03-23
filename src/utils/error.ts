import { t } from "elysia";

export const ERROR_MESSAGE = {
  USER_ALREADY_EXISTS: [409, "이미 존재하는 사용자입니다."],
  USER_NOT_FOUND: [404, "사용자를 찾을 수 없습니다."],
  INVALID_TYPE_USERNAME: [400, "유효하지 않은 사용자 이름(username)입니다."],
  INVALID_TYPE_PASSWORD: [400, "유효하지 않은 비밀번호(password)입니다."],
  INVALID_PASSWORD: [401, "비밀번호가 일치하지 않습니다."],
  INVALID_TOKEN: [401, "유효하지 않은 토큰입니다."],
  UNAUTHORIZED: [401, "인증되지 않은 사용자입니다."],
  NO_REFRESH_TOKEN: [401, "리프레시 토큰이 없습니다."],

  NOT_FOUNDED_KEY: [404, "찾을 수 없는 식당입니다."],
} as const;

export type ERROR_MESSAGE_TYPE = typeof ERROR_MESSAGE;
export type ERROR_KEY = keyof ERROR_MESSAGE_TYPE;
export type ERROR_STATUS = ERROR_MESSAGE_TYPE[ERROR_KEY][0];
export type ERROR_MESSAGES = ERROR_MESSAGE_TYPE[ERROR_KEY][1];
export type ERROR_RESPONSE = {
  success: false;
  code: ERROR_KEY;
  message: ERROR_MESSAGES;
};


const tmpElysia = t.Object({
  success: t.Boolean({
    default: false,
  }),
  code: t.String({
    default: "message" as ERROR_KEY,
  }),
  message: t.String({
    default: "msg" as ERROR_MESSAGES,
  }),
});
type ElysiaObj = typeof tmpElysia;

type Statuses<T extends ERROR_KEY[]> = (typeof ERROR_MESSAGE)[T[number]][0];
interface AdditionalElysia {
  isSignIn?: Boolean;
}

export const errorElysia = <T extends ERROR_KEY[]>(messages: T, additional?: AdditionalElysia) => {
  if (additional?.isSignIn) {
    messages.push("UNAUTHORIZED");
  }

  type S = Statuses<T>;
  const obj: Record<S, ElysiaObj> = {} as Record<S, ElysiaObj>;

  for (const message of messages) {
    const [status, msg] = ERROR_MESSAGE[message];
    obj[status as S] = t.Object({
      success: t.Boolean({ default: false }),
      code: t.String({
        default: message,
      }),
      message: t.String({
        default: msg,
      }),
    });
  }

  return obj;
};

const exit = (error: any, ERROR_KEY: ERROR_KEY) => {
  const [status, message] = ERROR_MESSAGE[ERROR_KEY];
  // set.status = status;
  // return {
  //   success: false,
  //   code: ERROR_KEY,
  //   message: message,
  // };
  return error(status, {
    success: false,
    code: ERROR_KEY,
    message: message,
  });
};

export default exit;
