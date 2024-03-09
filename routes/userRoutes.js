const express = require("express");
const app = express();
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  login
} = require("../controllers/userController");

app.use(protect)
router.route("/").get(protect, getUser);
router.route("/register").post(createUser);
router.route("/login").post(login)
router.route("/:id").put(protect, updateUser).delete(protect, deleteUser);



module.exports = router;
