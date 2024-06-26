import Elysia, { t } from "elysia";
import {
  CreateNotification,
  addJudge,
  createTeam,
  getJudge,
  loginJudge,
  loginUser,
  registerUser,
} from "../controller/adminController";
import { adminCheck } from "../middleware/adminProtect";
import { updateTeam } from "../controller/userController";

export const Admin = new Elysia({ prefix: "/admin" });
Admin.guard(
  {
    beforeHandle({ jwt, set, cookie: { admin } }: any) {
      return adminCheck(jwt, set, admin);
    },
  },
  (Admin) =>
    Admin.post(
      "/register",
      ({ jwt, body, set, cookie: { admin } }: any) =>
        registerUser(jwt, body, set, admin),
      {
        body: t.Object({
          name: t.String(),
          phone: t.String(),
          password: t.String(),
        }),
      }
    )
      .post(
        "/judge",
        ({ jwt, body, set, cookie: { admin } }: any) =>
          addJudge(jwt, body, set, admin),
        {
          body: t.Object({
            name: t.String(),
            phone: t.String(),
            password: t.String(),
          }),
        }
      )

      .patch(
        "/updateTeam",
        ({ body, set, jwt }: any) => updateTeam(body, set, jwt),
        {
          body: t.Object({
            id: t.String(),
            name: t.String(),
            password: t.String(),
            // phone: t.String(),
            profilePic: t.String(),
            teamLeader: t.String(),
            teamMembers: t.Array(t.String()),
            challenge: t.String(),
          }),
        }
      )
).post(
  "/crateNotification",
  ({ jwt, body, set }: any) => CreateNotification(jwt, body, set),
  {
    body: t.Object({
      name: t.String(),
      description: t.String(),
    }),
  }
);
Admin.post(
  "/login",
  ({ body, set, jwt, cookie: { admin } }: any) =>
    loginUser(body, set, jwt, admin),
  {
    body: t.Object({
      phone: t.String(),
      password: t.String(),
    }),
  }
)
  .post(
    "/loginJudge",
    ({ jwt, body, set, cookie: { admin } }: any) =>
      loginJudge(jwt, body, set, admin),
    {
      body: t.Object({
        phone: t.String(),
        password: t.String(),
      }),
    }
  )
  .post("/logout", ({ set, cookie: { admin } }) => {
    admin.remove();
    set.status = 200;
    return { message: "Logged out" };
  })
  .post(
    "/getJudge",
    ({ jwt, body, set, cookie: { admin } }: any) =>
      getJudge(jwt, body, set, admin),
    {
      body: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    "/createTeam",
    ({ jwt, body, set, cookie: { admin } }: any) =>
      createTeam(jwt, body, set, admin),
    {
      body: t.Object({
        name: t.String(),
        phone: t.String(),
        password: t.String(),
        profilePic: t.String(),
        teamLeader: t.String(),
        teamMembers: t.Array(t.String()),
      }),
    }
  )
  .patch(
    "/updateTeamChallenge",
    ({ body, set, jwt }: any) => updateTeam(body, set, jwt),
    {
      body: t.Object({
        id: t.String(),
        challenge: t.Object({}),
      }),
    }
  );
