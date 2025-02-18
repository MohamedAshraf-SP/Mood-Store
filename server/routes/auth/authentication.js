import express from "express";
import {
    login,
    refreshToken,
    logout,

} from "../../controllers/authentication.js";

export const authRoute = express.Router();

authRoute.get("/login", login);
authRoute.get("/refreshToken", refreshToken);
authRoute.get("/logout", logout);
