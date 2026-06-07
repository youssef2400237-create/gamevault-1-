import express from "express";
import { databaseConnection } from "./database/connection.js";
import userRouter from "./module/users/user.controller.js";
import adminRouter from "./module/admin/admin.controller.js";
import gamesRouter from "./module/games/games.controller.js";
import orderRouter from "./module/orders/order.controller.js";
import {
  catchError,
  notFoundError,
} from "./common/responce/errors.responce.js";
import { env } from "./config/env.service.js";
export const boostrap = () => {
  const app = express();
  app.use(express.json());
  databaseConnection();
  app.use(userRouter);
  app.use(adminRouter);
  app.use(gamesRouter);
  app.use(orderRouter);
  // connect backend to frontend
  app.set("view engine", "ejs");
  app.set("views", "./views");
  app.use("/*dummy", (req, res, next) => {
    return notFoundError({ message: "Page not found" });
  });

  app.use(catchError);
  app.listen(env.port, () =>
    console.log(`server is running on port ${env.port}`),
  );
};
