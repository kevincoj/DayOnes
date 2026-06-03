import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './src/routes/auth';
import habitRoutes from './src/routes/habits';
import postRoutes from './src/routes/posts';
import partnerRoutes from './src/routes/partners';
import userRoutes from './src/routes/users';
import likeRoutes from "./src/routes/likes";
import commentRoutes from "./src/routes/comments";
import notificationRoutes from './src/routes/notifications';
import pactRoutes from "./src/routes/pacts";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/posts", likeRoutes);
app.use("/api/posts", commentRoutes);
app.use("/api/pacts", pactRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
