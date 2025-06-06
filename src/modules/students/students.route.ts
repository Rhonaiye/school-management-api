import { Router } from 'express';
import { getStudentByNameController, registerStudentController, addStudentToClassController, getStudentProfileController } from './students.controller';
import authMiddleware from '../../middleware/auth';

const router = Router();


router.get('/name/:fullName', getStudentByNameController);
router.get('/profile', authMiddleware, getStudentProfileController);


router.post('/register', registerStudentController);
router.post('/add-to-class/:classId', authMiddleware, addStudentToClassController);


export default router;
