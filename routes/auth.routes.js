const express = require("express");
const authControl = require("../controllers/auth.controller");
const router = express.Router();

router.route("/signup").post(authControl.signup);
router.route("/signin").post(authControl.signIn);
router.route("/signout").get(authControl.signout);

module.exports = router;
