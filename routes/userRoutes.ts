import jwt from "@elysiajs/jwt";
import { protectedRoute } from "../middleware/protectedRoute";
import Elysia, { t } from "elysia";
import {
  loginTeam,
  signupTeam,
  verifyPhone,
} from "../controller/userController";
const tokensec: any = process.env.JWT_SECRET;
export const users = new Elysia({ prefix: "/users" })
  .use(
    jwt({
      name: "jwt",
      secret: tokensec,
      exp: "15d",
    })
  )
  .post(
    "/signup",
    ({ jwt, body, set, cookie: { auth } }: any) =>
      signupTeam(body, set, jwt, auth),
    {
      body: t.Object({
        name: t.String(),
        phone: t.String(),
        password: t.String(),
        teamLeader: t.String(),
        profilePic: t.String(),
      }),
    }
  )
  .post(
    "/verify",
    ({ jwt, body, set, cookie: { auth } }: any) =>
      verifyPhone(body, set, jwt, auth),
    {
      body: t.Object({
        userId: t.String(),
        secret: t.String(),
        name: t.String(),
        phone: t.String(),
        password: t.String(),
        teamLeader: t.String(),
        profilePic: t.String(),
      }),
    }
  )
  .post(
    "/login",
    ({ jwt, body, set, cookie: { auth } }: any) =>
      loginTeam(jwt, body, set, auth),
    {
      body: t.Object({
        phone: t.String(),
        password: t.String(),
      }),
    }
  )
  .post("/logout", ({ cookie: { auth }, set }) => {
    auth.remove();
    set.status = 200;
    return "User logged out successfully";
  });
