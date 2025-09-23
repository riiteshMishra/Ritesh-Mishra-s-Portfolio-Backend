const express = require("express");
const { updateProfile } = require("../controllers/Profile");
const { auth } = require("../middlewares/Authorization");
const router = express.Router();

router.post("/update-profile", auth, updateProfile);

module.exports = router;
