import express from "express"
import { register, login, logout, getUsers, getUser, profile } from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/checkRole.js";

const router=express.Router()


router.post("/register",register);
router.post("/login",login);
router.post("/logout",auth, logout);
router.get("/profile",auth, profile);
router.get("/",auth, checkRole("admin"), getUsers); 
router.get("/:id",auth, checkRole("admin"), getUser);

export default router

