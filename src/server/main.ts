import express from "express";
import ViteExpress from "vite-express";
import cors from 'cors';
import connectDB from "./utils/db";
import authRoutes from './routes/authRoutes';
import fileRoutes from './routes/fileRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', authRoutes);
app.use('/api', fileRoutes);
app.use('/api', userRoutes);

connectDB().then(() => {
  ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000..."),
  );
});