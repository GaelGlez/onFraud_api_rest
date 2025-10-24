/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // 10-12 es un buen balance entre seguridad y rendimiento

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};

