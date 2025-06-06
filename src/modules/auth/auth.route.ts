import { Router } from "express";
import { loginController, registerAdminController, registerTeacherController, getUserProfileController } from "./auth.controller";
import { registerStudentController } from "../students/students.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.post("/login", loginController);
router.post("/register/student", registerStudentController);
router.post("/register/admin", registerAdminController);


router.get('/get-profile', authMiddleware, getUserProfileController)

export default router;
