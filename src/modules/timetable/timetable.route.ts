import { Router } from 'express';
import { exampleController } from './timetable.controller';

const router = Router();
router.get('/', exampleController);
export default router;
