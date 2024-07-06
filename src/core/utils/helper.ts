import * as bcrypt from 'bcrypt';
const SALTROUNDS = 10;
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALTROUNDS);
}

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
}