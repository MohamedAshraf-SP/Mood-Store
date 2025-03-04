import express from "express";

import usersRoute from "./users.js";

//import emailSenderRouter from "./email.js";
import helpersRoute from "./helpers/consts.js";
import addressRouter from "./addresses.js";
import visitorsOrdersRoute from "./orders/visitorsOrders.js";
import JNTOrdersRoute from "./orders/JNTOrders.js";
import productsRoute from "./products.js";
import { authRoute } from "./auth/authentication.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";
import categoriesRoute from "./categories.js";
import { deleteAllCollections } from "../config/resetDB.js";
import ordersRouter from "./orders/mainOrders.js";

// import {
//   roleMiddleware,
//   authMiddleware,
// } from "./../middlewares/Middlewares.js";

const router = express.Router();

router.use("/v1/auth", authRoute);

//router.use(authMiddleware)


router.use("/v1/addresses", addressRouter);
router.use("/v1/helpers", helpersRoute);
router.use("/v1/users", usersRoute);
router.use("/v1/visitors/orders", visitorsOrdersRoute);
router.use("/v1/jnt/orders", JNTOrdersRoute);
router.use("/v1/orders/", ordersRouter);
router.use("/v1/products/", productsRoute);
router.use("/v1/categories/", categoriesRoute);
router.use("/v1/resetDB/", deleteAllCollections);



// /v1/Students/Count

export default router;

// module.exports=router
