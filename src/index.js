import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';
import connectDB from './db.js';
import { startBot } from './bot.js';

dotenv.config();
connectDB();

const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/user', userRouter);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    startBot();
});
