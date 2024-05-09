import { Router } from 'express';
import { router as authRouter } from './auth.routes';

export const router = Router();

router.use('/auth', authRouter);
