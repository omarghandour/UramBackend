import Elysia, { t } from "elysia";
import { registerUser } from "../controller/adminController";
import { adminCheck } from "../middleware/adminProtect";

export const Admin = new Elysia({ prefix: "/admin" });
Admin.guard(
  {
    beforeHandle({ jwt, set, cookie: { auth } }: any) {
      return adminCheck(jwt, set, auth);
    },
  },
  (Admin) =>
    Admin.post(
      "/register",
      ({ jwt, body, set, cookie: { auth } }: any) =>
        registerUser(body, set, jwt, auth),
      {
        body: t.Object({
          name: t.String(),
          phone: t.String(),
          password: t.String(),
          role: t.String(),
        }),
      }
    )
);
