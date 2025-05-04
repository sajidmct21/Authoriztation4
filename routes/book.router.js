import { getAllBooks } from "../controllers/book.controller.js";
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeUser } from "../middleware/authorizeUser.js";

const router = express.Router();

router.route("/getAllBooks").get(verifyToken,authorizeUser('Admin','Manager'),getAllBooks);

export default router
