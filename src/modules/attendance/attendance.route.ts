import { Router } from 'express';
import { exampleController } from './attendance.controller';

const router = Router();
router.get('/', exampleController);
export default router;
