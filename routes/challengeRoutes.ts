import Elysia, { t } from "elysia";
import { adminCheck } from "../middleware/adminProtect";
import {
  createChallenge,
  deleteChallenge,
  updateChallenge,
} from "../controller/challengeController";
export const Challenge = new Elysia({ prefix: "/Challenge" });
Challenge.guard(
  {
    beforeHandle({ jwt, set, cookie: { admin } }: any) {
      return adminCheck(jwt, set, admin);
    },
  },
  (Challenge) =>
    Challenge.post(
      "/createChallenge",
      ({ jwt, body, set, cookie: { admin } }: any) =>
        createChallenge(jwt, body, set, admin),
      {
        body: t.Object({
          name: t.String(),
          description: t.String(),
        }),
      }
    )
      .patch(
        "/updateChallenge",
        ({ jwt, body, set, cookie: { admin } }: any) =>
          updateChallenge(jwt, body, set, admin),
        {
          body: t.Object({
            id: t.String(),
            name: t.String(),
            description: t.String(),
          }),
        }
      )
      .delete(
        "/deleteChallenge",
        ({ jwt, body, set, cookie: { admin } }: any) =>
          deleteChallenge(jwt, body, set, admin),
        {
          body: t.Object({
            id: t.String(),
          }),
        }
      )
);
