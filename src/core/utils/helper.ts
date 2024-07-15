import * as bcrypt from 'bcrypt';
const SALTROUNDS = 10;
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALTROUNDS);
};

export const comparePasswords = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export function formatBytes(bytes: any, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
export const convertToDigits = (number: number) => {
  if (number <= 9) return `0${number}`;
  return `${number}`;
};
export const randomFileName = Array(32)
  .fill(null)
  .map(() => Math.round(Math.random() * 16).toString(16))
  .join('');
  
export function getExtenstionFromOriginalName(originalname: string): string {
  return originalname?.includes('.')
  ? originalname.split('.').pop()
  : '';
}
export function getFileNameWithoutExtension(originalname: string): string {
  if(originalname?.includes('.')) {

    return originalname.substring(0, originalname.lastIndexOf('.'));
  }
  return originalname;
}
