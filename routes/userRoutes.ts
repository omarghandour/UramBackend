import jwt from "@elysiajs/jwt";
import { protectedRoute } from "../middleware/protectedRoute";
import Elysia, { t } from "elysia";
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
      signupUser(body, set, jwt, auth),
    {
      body: t.Object({
        name: t.String(),
        phone: t.String(),
        password: t.String(),
        teamLeader: t.String(),
        teamMembers: t.String(),
        profilePic: t.String(),
      }),
    }
  )
  .post("/login", ({ jwt, body, set, cookie: { auth } }: any) => {}, {
    body: t.Object({
      phone: t.String(),
      password: t.String(),
    }),
  })
  .post("/logout", ({ cookie: { auth }, set }) => {
    auth.remove();
    set.status = 200;
    return "User logged out successfully";
  });
function signupUser(body: any, set: any, jwt: any, auth: any): any {
  throw new Error("Function not implemented.");
}
