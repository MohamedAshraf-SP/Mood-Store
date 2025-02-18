import express from "express";
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  addUser,
} from "../controllers/users.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const usersRoute = express.Router();


usersRoute.delete("/:id", deleteUser);
usersRoute.post("/:id", getUser);
usersRoute.post("/", addUser);
usersRoute.get("/", getUsers);
usersRoute.put("/:id", updateUser);


export default usersRoute;
