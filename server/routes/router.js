import express from "express";

import usersRoute from "./users.js";

//import emailSenderRouter from "./email.js";
import helpersRoute from "./helpers/consts.js";
import addressRouter from "./addresses.js";
import { authRoute } from "./auth/authentication.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";

// import {
//   roleMiddleware,
//   authMiddleware,
// } from "./../middlewares/Middlewares.js";

const router = express.Router();

router.use("/v1/auth", authRoute);

//router.use(authMiddleware)


router.use("/v1/addresses", addressRouter);
router.use("/v1/helpers", helpersRoute);
router.use("/v1", usersRoute);

// /v1/Students/Count

export default router;

// module.exports=router
