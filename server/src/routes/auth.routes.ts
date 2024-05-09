import { Router } from 'express';
import { signup } from '../controllers/authControllers';

export const router = Router();

router.route('/signup').post(signup);
