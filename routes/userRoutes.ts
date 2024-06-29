import jwt from "@elysiajs/jwt";
import { protectedRoute } from "../middleware/protectedRoute";
import Elysia, { t } from "elysia";
import {
  getNotifications,
  getTeam,
  loginTeam,
  signupTeam,
  updateTeam,
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
    ({ jwt, body, set, cookie: { auth, admin } }: any) =>
      signupTeam(body, set, jwt, auth, admin),
    {
      body: t.Object({
        phone: t.String(),
        password: t.String(),
      }),
    }
  )
  // .post(
  //   "/verify",
  //   ({ jwt, body, set, cookie: { auth } }: any) =>
  //     verifyPhone(body, set, jwt, auth),
  //   {
  //     body: t.Object({
  //       userId: t.String(),
  //       secret: t.String(),
  //       phone: t.String(),
  //     }),
  //   }
  // )
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
  .post("/logout", ({ cookie: { Team }, set }) => {
    Team.remove();
    set.status = 200;
    return "User logged out successfully";
  })
  .post("/getTeam", ({ body, set, jwt }) => getTeam(body, set, jwt), {
    body: t.Object({
      id: t.String(),
    }),
  })
  // .patch("/updateTeam", ({ body, set, jwt }) => updateTeam(body, set, jwt), {
  //   body: t.Object({
  //     id: t.String(),
  //     name: t.String(),
  //     password: t.String(),
  //     phone: t.String(),
  //     profilePic: t.String(),
  //     teamLeader: t.String(),
  //     // challengeName: t.String(),
  //     // challengeType: t.String(),
  //   }),
  // })
  .get("/getNotification", ({ set }) => getNotifications(set));
