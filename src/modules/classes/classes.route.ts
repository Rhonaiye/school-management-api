import { Router } from 'express';
import { createClass, getAllClasses, getClassById, updateClass, deleteClass } from './classes.controller';
import authMiddleware from '../../middleware/auth';


const router = Router();

router.post('/create', authMiddleware, createClass);
router.get('/', authMiddleware, getAllClasses);
router.get('/:id', authMiddleware, getClassById);
router.put('/update/:id', authMiddleware, updateClass);
router.delete('/delete/:id', authMiddleware, deleteClass);

export default router;
