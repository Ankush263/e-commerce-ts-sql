import pool from '../pool';
import { toCamelCase } from './utils/to-camel-case';

export class UserRepo {
	static async find() {
		const { rows } = await pool.query('SELECT * FROM users');
		return toCamelCase(rows);
	}

	static async create(
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		role: string
	) {
		const { rows } = await pool.query(
			`
      INSERT INTO users(firstName, lastName, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
			[firstName, lastName, email, password, role]
		);
		return toCamelCase(rows)[0];
	}

	static async findByEmail(email: string) {
		const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
			email,
		]);
		return toCamelCase(rows);
	}
}
