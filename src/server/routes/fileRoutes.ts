import { Router } from 'express';
import {
    uploadFile,
    listFiles,
    getFileDetail,
    deleteFile,
    renameFile,
    shareFile,
} from '../controllers/fileController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/upload', authMiddleware, uploadFile);
router.get('/files', authMiddleware, listFiles);
router.get('/files/:id', authMiddleware, getFileDetail);
router.delete('/files/:id', authMiddleware, deleteFile);
router.put('/files/:id', authMiddleware, renameFile);
router.post('/files/:id/share', authMiddleware, shareFile);

export default router;
