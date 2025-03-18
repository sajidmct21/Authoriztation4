import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeUser } from "../middleware/authorizeUser.js";

const router = express.Router();

router
  .route("/getAllUsers")
  .get(getAllUsers);
router.route("/getUserById/:id").get(verifyToken,authorizeUser('Admin','User'), getUserById);
router.route("/updateUser/:id").patch(verifyToken, authorizeUser("Admin","User"), updateUser);
router.route("/deleteUser/:id").delete(verifyToken,authorizeUser('Admin','User'), deleteUser);

export default router;
