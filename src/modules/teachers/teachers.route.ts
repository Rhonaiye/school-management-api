import { Router } from 'express';
import { registerTeacherController } from './teachers.controller';

const router = Router();

router.post('/register', registerTeacherController);

export default router;
