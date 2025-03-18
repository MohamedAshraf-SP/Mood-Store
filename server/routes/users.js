import express from "express";
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  addUser,
  getCount
} from "../controllers/users.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const usersRoute = express.Router();

usersRoute.use(authMiddleware, roleMiddleware(["admin"]))
usersRoute.get("/counts", getCount);
usersRoute.delete("/:id", deleteUser);
usersRoute.post("/:id", getUser);
usersRoute.post("/", addUser);
usersRoute.get("/", getUsers);
usersRoute.put("/:id", updateUser);

export default usersRoute;
