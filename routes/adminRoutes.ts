import Elysia, { t } from "elysia";
import {
  CreateChallenge,
  CreateNotification,
  Dashboard,
  UpdeteTeamJudge,
  addJudge,
  addRating,
  addScore,
  createTeam,
  getChallenge,
  getJudge,
  getScore,
  getTeams,
  loginJudge,
  loginUser,
  registerUser,
  teamsByJudge,
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
        photo: t.Optional(t.String()),
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
    "/updateTeamJudge/:id",
    ({ body, set, params }: any) => UpdeteTeamJudge(body, set, params),
    {
      body: t.Object({
        judgeId: t.String(),
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
        type: t.String(),
      }),
    }
  )
  .post("/challenge", ({ body, set }) => getChallenge(body, set), {
    body: t.Object({
      id: t.String(),
    }),
  })
  .get("dashboard/:ch", ({ params, set }) => Dashboard(params, set), {
    params: t.Object({
      ch: t.String(),
    }),
  })
  .patch(
    "/addRating/:id",
    ({ params, body, set }) => addRating(params, body, set),
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        rating: t.Number(),
      }),
    }
  )
  .post("/teamsByjudge", ({ body, set }) => teamsByJudge(body, set), {
    body: t.Object({
      id: t.String(),
    }),
  })
  .post(
    "/addScore/:id",
    ({ params, body, set }) => addScore(params, body, set),
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        score: t.Number(),
        judgeId: t.String(),
      }),
    }
  )
  .post("/getScore", ({ body, set }) => getScore(body, set), {
    body: t.Object({
      id: t.String(),
    }),
  });
