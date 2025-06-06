import { Router } from 'express';
import { exampleController } from './promotions.controller';

const router = Router();
router.get('/', exampleController);
export default router;
