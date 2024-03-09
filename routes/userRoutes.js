// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.route("/").post(createUser).get(getUser);
router.route("/:id").put(updateUser).delete(deleteUser);



module.exports = router;
