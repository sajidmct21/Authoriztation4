import express from "express";
import { login, register, sendEmail,resetPassword,logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/register").post(register);
router.route('/login').post(login);
router.route('/logout').get(logout)

// send reset email
router.route('/send-email').post(sendEmail)

// reset Password
router.route('/reset-password').post(resetPassword)

export default router;
