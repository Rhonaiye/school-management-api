import { Router } from 'express';
import { exampleController } from './subjects.controller';

const router = Router();
router.get('/', exampleController);
export default router;
