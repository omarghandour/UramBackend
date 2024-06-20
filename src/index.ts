import { Elysia } from "elysia";
import connectDB from "../db/connectDB";
import cors from "@elysiajs/cors";
import { users } from "../routes/userRoutes";
import swagger from "@elysiajs/swagger";
import { Admin } from "../routes/adminRoutes";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(
    cors({
      origin: "*",
      credentials: true,
    })
  )
  .use(users)
  .use(Admin)

  .listen(3000);
connectDB();
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

// .use(
//   swagger({
//     path: "/v2/swagger",
//   })
// )
