import { Router } from 'express';
import { listUsers } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/users', authMiddleware, listUsers);

export default router;
