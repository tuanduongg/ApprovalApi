import * as bcrypt from 'bcrypt';
import { readdir, stat } from 'fs/promises';
import * as path from 'path';



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
  return originalname?.includes('.') ? originalname.split('.').pop() : '';
}
export function getFileNameWithoutExtension(originalname: string): string {
  if (originalname?.includes('.')) {
    return originalname.substring(0, originalname.lastIndexOf('.'));
  }
  return originalname;
}

//2024-07-31T17:00:00.000Z -> 2024-07-31T23:59:00.000Z
export function convertToEndOfDay(dateString: string) {
  // Tạo một đối tượng Date từ chuỗi thời gian
  const date = new Date(dateString);

  // Đặt thời gian là 23:59:00.000
  date.setUTCHours(23, 59, 0, 0);

  // Trả về chuỗi thời gian mới theo định dạng ISO
  return date.toISOString();
}
export const dirSize = async (dir) => {
  const files = await readdir(dir, { withFileTypes: true });

  const paths = files.map(async (file) => {
    const pathFile = path.join(dir, file.name);

    if (file.isDirectory()) return await dirSize(pathFile);

    if (file.isFile()) {
      const { size } = await stat(pathFile);

      return size;
    }

    return 0;
  });

  return (await Promise.all(paths))
    .flat(Infinity)
    .reduce((i, size) => i + size, 0);
}