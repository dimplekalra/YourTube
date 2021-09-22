const express = require("express");
const router = express.Router();

// const authControl = require("../controllers/auth.controller");
// const mediaControl = require("../controllers/media.controller");
// const userControl = require("../controllers/user.controller");

const authControl = require("../controllers/auth.controller");
const mediaControl = require("../controllers/media.controller");
const userControl = require("../controllers/user.controller");

router
  .route("/new/:userId")
  .post(authControl.requireSignin, mediaControl.create);

router.route("/video/:mediaId").get(mediaControl.video);

router.route("/list").get(authControl.requireSignin, mediaControl.listMedias);

router.route("/popular").get(mediaControl.listPopular);

router
  .route("/by/:userId")
  .get(authControl.requireSignin, mediaControl.listByUser);

router
  .route("/:mediaId")
  .get(mediaControl.incrementViews, mediaControl.read)
  .put(authControl.requireSignin, mediaControl.isPoster, mediaControl.update)
  .delete(
    authControl.requireSignin,
    mediaControl.isPoster,
    mediaControl.remove
  );
router.route("/related/:mediaId").get(mediaControl.listRelated);

router.param("mediaId", mediaControl.mediaById);
router.param("userId", userControl.userById);

module.exports = router;
