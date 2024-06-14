import { Elysia } from "elysia";
import connectDB from "../db/connectDB";
import cors from "@elysiajs/cors";
import { users } from "../routes/userRoutes";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(cors())
  .use(users)
  .listen(3000);

connectDB();
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
