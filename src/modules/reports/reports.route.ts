import { Router } from 'express';
import { exampleController } from './reports.controller';

const router = Router();
router.get('/', exampleController);
export default router;
