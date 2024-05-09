import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

// npm run migrate create user table
// DATABASE_URL=postgres://postgres:Ankush@postgres263@localhost:5432/e-commerce-sql npm run migrate up

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.sql(
		`
    CREATE TYPE user_role AS ENUM ('business', 'customer');

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(300) NOT NULL CHECK (LENGTH(password) >= 8),
      role user_role DEFAULT 'customer'
    );
    `
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.sql(
		`
    DROP TABLE users;
    DROP TYPE user_role;
    `
	);
}
