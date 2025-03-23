import Bun from "bun";
import Elysia, { t } from "elysia";
import { type JWTPayload, SignJWT, jwtVerify } from "jose";
import mongoose, { type Document } from "mongoose";

import exit from "@/utils/error";

interface DUser {
  username: string;
  password: string;
}
type IUser = Document<DUser> & DUser;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
const UserDB = mongoose.model<IUser>("User", userSchema);

const findById = async (id: string) => {
  return await UserDB.findById(id);
};

const findByUsername = async (username: string) => {
  return await UserDB.findOne({
    username,
  });
};

const create = async ({ username, password }: { username: string; password: string }) => {
  const user = new UserDB({
    username: username,
    password: await Bun.password.hash(password),
  });
  await user.save();
  return user;
};

interface TokenPayload extends JWTPayload {
  id: string;
}

const generateToken = async (user: IUser, type: "access" | "refresh") => {
  const { username, _id } = user;
  const payload: TokenPayload = {
    id: _id.toString(),
    username,
  };
  const secret = new TextEncoder().encode(Bun.env.JWT_SECRET ?? "");
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("kiugi")
    .setExpirationTime(type === "access" ? "15m" : "7d")
    .sign(secret);
  return token;
};

const verifyToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    const secret = new TextEncoder().encode(Bun.env.JWT_SECRET ?? "");
    const verify = await jwtVerify<TokenPayload>(token, secret);
    return verify.payload;
  } catch {
    return null;
  }
};

const User = new Elysia()
  .model({
    user: t.Object({
      username: t.String(),
      password: t.String(),
    }),
  })
  .decorate("user", {
    findById,
    findByUsername,
    create,
    generateToken,
    verifyToken,
  });

export default User;
