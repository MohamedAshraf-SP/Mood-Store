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


usersRoute.delete("/user/d/:id", deleteUser);
usersRoute.post("/user/:id", getUser);
usersRoute.post("/user", addUser);
usersRoute.post("/users", getUsers);
usersRoute.put("/user/:id", updateUser);


export default usersRoute;
