import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { UserRepo } from '../repo/user-repo';
import dotenv from 'dotenv';
import { NextFunction, Response, Request } from 'express';
import bcrypt from 'bcryptjs';

dotenv.config();

const signToken = (id: string) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createAndSendToken = (user: any, statusCode: number, res: Response) => {
	const token = signToken(user.id);

	const cookieOptions: {
		expires: Date;
		httpOnly: boolean;
		secure?: boolean;
	} = {
		expires: new Date(
			Date.now() +
				parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);

	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

export const signup = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const {
			firstName,
			lastName,
			email,
			password,
			role,
		}: {
			firstName: string;
			lastName: string;
			email: string;
			password: string;
			role: string;
		} = req.body;

		const existUser = await UserRepo.findByEmail(email);

		if (existUser.length > 0) {
			return next(new AppError('User with this email is already exists', 404));
		}

		if (!email || !password) {
			return next(new AppError('Please provide email and password', 404));
		}

		const hashedPasswoed: string = bcrypt.hashSync(password, 12);

		const newUser = await UserRepo.create(
			firstName,
			lastName,
			email,
			hashedPasswoed,
			role
		);

		createAndSendToken(newUser, 201, res);
	}
);
