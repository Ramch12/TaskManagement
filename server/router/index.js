const express = require("express");
const { userRoute } = require("./users");
const { projectRoute } = require("./projectRoute");
const { taskRoute } = require("./taskRoute");

const router = express.Router();

router.use("/api/v1/user", userRoute);
router.use("/api/v1/project", projectRoute);
router.use("/api/v1/task", taskRoute);

module.exports = router;
