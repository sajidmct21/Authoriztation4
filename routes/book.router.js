import { getAllBooks } from "../controllers/book.controller.js";
import express from "express";

const router = express.Router();

router.route("/getAllBooks").get(getAllBooks);

export default router
