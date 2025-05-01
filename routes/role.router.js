import express from "express";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from "../controllers/role.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeUser } from "../middleware/authorizeUser.js";

const router = express.Router();

router.route("/createRole").post(verifyToken,authorizeUser('Admin'),createRole);
// router.route("/getAllRoles").get(verifyToken, authorizeUser('Admin','Manager'),getAllRoles);
router.route("/getAllRoles").get(getAllRoles);

router.route("/getRoleById/:id").get(verifyToken,authorizeUser('Admin','Manager'), getRoleById);
router.route("/updateRole/:id").put(verifyToken,authorizeUser('Admin','Manager'), updateRole);
router.route("/deleteRole/:id").delete(verifyToken,authorizeUser('Admin','Manager'),deleteRole);

export default router;
