import express from "express";
import {
  updateUserProfile,
  logoutUser,
  getUserProfile,
  getProfileById,
} from "../controllers/auth.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Profile routes - protected by Firebase token verification
router.put("/profile/update", isAuthenticated, singleUpload, updateUserProfile);
router.get("/logout", isAuthenticated, logoutUser);
router.get("/profile",isAuthenticated, getUserProfile);
router.get("/users/:id", getProfileById);


export default router;