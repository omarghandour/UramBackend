import Elysia, { t } from "elysia";
import {
  CreateChallenge,
  CreateNotification,
  addJudge,
  createTeam,
  getJudge,
  getTeams,
  loginJudge,
  loginUser,
  registerUser,
} from "../controller/adminController";
import { adminCheck } from "../middleware/adminProtect";
import { UpdeteTeamChallenge, updateTeam } from "../controller/userController";

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
    ).post(
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
)
  .post(
    "/crateNotification",
    ({ jwt, body, set }: any) => CreateNotification(jwt, body, set),
    {
      body: t.Object({
        name: t.String(),
        description: t.String(),
      }),
    }
  )
  .get("/getTeams", ({ set }) => getTeams(set));
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
    "/updateTeamChallenge/:id",
    ({ body, set, jwt, params }: any) =>
      UpdeteTeamChallenge(body, set, jwt, params),
    {
      body: t.Object({
        challenge: t.String(),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .patch(
    "/updateTeam/:id",
    ({ body, set, jwt, params }: any) => updateTeam(body, set, jwt, params),
    {
      body: t.Object({
        name: t.String(),
        phone: t.String(),
        password: t.String(),
        profilePic: t.String(),
        teamLeader: t.String(),
        // teamMembers: t.Array(t.String()),
        // challenge: t.String(),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    "/CreateChallenge",
    ({ body, set, jwt }: any) => CreateChallenge(body, set, jwt),
    {
      body: t.Object({
        name: t.String(),
        description: t.String(),
      }),
    }
  );
