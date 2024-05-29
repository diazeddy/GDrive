import { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import File from '../models/File';
import User from '../models/User';

const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
}).single('file');

export const uploadFile = (req: Request, res: Response) => {
    const userId = req.user?.userId;

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading file', err });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const totalSize = user.files.reduce((acc, file) => acc + file.size, 0) + file.size;
            if (totalSize > 50 * 1024 * 1024) {
                fs.unlinkSync(file.path);
                return res.status(400).json({ message: 'Storage limit exceeded' });
            }

            const newFile = new File({
                name: file.originalname,
                size: file.size,
                path: file.path,
                owner: userId,
                sharedWith: [],
            });

            await newFile.save();

            user.files.push(newFile._id);
            await user.save();

            res.status(201).json(newFile);
        } catch (error) {
            res.status(500).json({ message: 'Error saving file', error });
        }
    });
};

export const listFiles = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    try {
        const files = await File.find({
            $or: [
              { owner: userId },
              { sharedWith: userId }
            ]
        }).populate('owner', 'username');
      
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching files', error });
    }
};

export const getFileDetail = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    try {
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.owner.toString() !== userId && !file.sharedWith.includes(userId)) {
            return res.status(403).json({ message: 'Not authorized to access this file' });
        }

        res.json(file);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching file detail', error });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    try {
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this file' });
        }

        fs.unlinkSync(file.path);
        await File.findByIdAndDelete(id);

        const user = await User.findById(userId);
        if (user) {
            user.files = user.files.filter(fileId => fileId.toString() !== id);
            await user.save();
        }

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting file', error });
    }
};

export const renameFile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user?.userId;

    try {
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to rename this file' });
        }

        file.name = name;
        await file.save();

        res.json(file);
    } catch (error) {
        res.status(500).json({ message: 'Error renaming file', error });
    }
};

export const shareFile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;
    const ownerId = req.user?.userId;
  
    try {
      const file = await File.findById(id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      if (file.owner.toString() !== ownerId) {
        return res.status(403).json({ message: 'Not authorized to share this file' });
      }
  
      if (file.sharedWith.includes(userId)) {
        return res.status(400).json({ message: 'File already shared with this user' });
      }
  
      file.sharedWith.push(userId);
      await file.save();
  
      res.json({ message: 'File shared successfully' });
    } catch (error) {
        console.error('Error sharing file:', error);
        res.status(500).json({ message: 'Error sharing file', error });
    }
};
