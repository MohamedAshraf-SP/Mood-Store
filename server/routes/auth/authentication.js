import express from "express";
import {
    login,
    refreshToken,
    logout,

} from "../../controllers/authentication.js";

export const authRoute = express.Router();

authRoute.post("/login", login);
authRoute.post("/refreshToken", refreshToken);
authRoute.get("/logout", logout);
