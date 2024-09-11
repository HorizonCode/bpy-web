import { getMySQLDatabase, getRedisClient } from '../hooks.server';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import type { DBUser } from './types';

export const createPassword = (plainPassword: string): Promise<string> => {
	const pw_md5 = crypto.createHash('md5').update(plainPassword).digest('hex');
	const bw_bcrypt = bcrypt.hash(pw_md5, 10);
	return bw_bcrypt;
};

export async function comparePasswords(plainPassword: string, hashed_pw: string): Promise<boolean> {
	return await bcrypt.compare(
		crypto.createHash('md5').update(plainPassword).digest('hex'),
		hashed_pw
	);
}

export const login = async (opts: {
	username: string;
	password: string;
}): Promise<DBUser | undefined> => {
	const { username, password } = opts;
	const mysqlDatabase = await getMySQLDatabase();
	const userResult = await mysqlDatabase<DBUser>('users')
		.where(function () {
			if (username.includes('@')) this.where('email', username);
			else this.where('name', username);
		})
		.limit(1)
		.first();
	if (!userResult) return undefined;
	const hashedPassword = userResult.pw_bcrypt;
	const isPasswordCorrect = await comparePasswords(password, hashedPassword);
	if (!isPasswordCorrect) return undefined;
	return userResult;
};

export const getUserFromSession = async (sessionToken: string): Promise<DBUser | undefined> => {
	const redisClient = await getRedisClient();
	const userId = await redisClient.get(`user:session:${sessionToken}`);
	if (!userId) return undefined;
	const mysqlDatabase = await getMySQLDatabase();
	const user = await mysqlDatabase<DBUser>('users').where('id', userId).first();
	return user;
};
