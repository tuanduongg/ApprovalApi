import * as bcrypt from 'bcrypt';
import { readdir, stat } from 'fs/promises';
import * as path from 'path';

import * as fs from 'fs';

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
};

export const handleFiles = async (
  files: Express.Multer.File[],
  folderName: string = '',
) => {
  if (!files || files?.length <= 0) {
    return [];
  }

  const arrFile = files.map((file) => {
    if (file) {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(now.getDate()).padStart(2, '0');
        const folderUpload = path.join(
          folderName ? folderName : 'uploads',
          `${day}${month}${year}`,
        );
        const uploadPath = path.join(
          process.env.UPLOAD_FOLDER || './public',
          folderUpload,
        );
        // Tạo thư mục nếu chưa tồn tại
        fs.mkdirSync(uploadPath, { recursive: true });

        const uniqueSuffix = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        const extension = getExtenstionFromOriginalName(file?.originalname);
        const fileName = `${uniqueSuffix}${extension ? '.' + extension : ''}`;
        const urlStoreDB = path.join(folderUpload, fileName);
        const targetPath = path.join(uploadPath, fileName);

        const readableStream = fs.createReadStream(file?.path);
        const writableStream = fs.createWriteStream(targetPath);

        readableStream.pipe(writableStream);

        readableStream.on('error', (error) => {
          console.error('Error reading file:', error);
          fs.stat(file?.path, function (err, stats) {
            if (err) {
              return console.error(err);
            }
            fs.unlinkSync(file?.path); // Xóa tệp tạm thời nếu có lỗi
          });
        });

        writableStream.on('error', (error) => {
          console.error('Error writing file:', error);
          fs.stat(file?.path, function (err, stats) {
            if (err) {
              return console.error(err);
            }
            fs.unlinkSync(file?.path); // Xóa tệp tạm thời nếu có lỗi
          });
          fs.stat(file?.path, function (err, stats) {
            if (err) {
              return console.error(err);
            }
            fs.unlinkSync(targetPath); // Xóa tệp đích nếu có lỗi
          });
        });

        writableStream.on('finish', () => {
          fs.stat(file?.path, function (err, stats) {
            if (err) {
              return console.error(err);
            }
            fs.unlinkSync(file?.path); // Xóa tệp tạm thời khi barn ghi hoan tat
          });
        });
        return { ...file, urlStoreDB };
      } catch (error) {
        console.error('Error handling file:', error);
        throw error;
      }
    }
  });
  return arrFile;
};

// const getExtenstionFromOriginalName = (originalname: string) => {
//   const ext = originalname.split('.').pop();
//   return ext ? ext : '';
// };

export const LIST_COL_REPORT_QC = [
  { key: 'category', header: 'Category', width: 10 },
  { key: 'model', header: 'Model', width: 10 },
  { key: 'plName', header: 'PL/Name', width: 10 },
  { key: 'code', header: 'Code', width: 17 },
  { key: 'item', header: 'Item', width: 10 },
  { key: 'shift', header: 'Shift', width: 10 },
  { key: 'week', header: 'Week', width: 8 },
  { key: 'time', header: 'Date', width: 10 },
  { key: 'nameNG', header: '불량명(Tên Lỗi)', width: 20 },
  { key: 'percentageNG', header: 'Tỷ Lệ', width: 15 },
  { key: 'process', header: '부적합 통보', width: 15 },
  { key: 'supplier', header: '고객(Khách hàng)', width: 20 },
  { key: 'attributable', header: '귀책처(Chịu trách nhiệm)', width: 30 },
  {
    key: 'representative',
    header: '공급 업체 담당자(Đại diện NCC)',
    width: 30,
  },
  { key: 'techNG', header: '불량원인(Nguyên nhân lỗi)', width: 30 },
  { key: 'tempSolution', header: '임시조치(Biện pháp)', width: 30 },
  { key: 'dateRequest', header: 'Request Date', width: 20 },
  { key: 'dateReply', header: 'Reply Date', width: 20 },
  { key: 'seowonStock', header: 'Seowon Stock', width: 17 },
  { key: 'vendorStock', header: 'Vendor Stock', width: 17 },
  { key: 'author', header: '등록자(Người đăng ký)', width: 25 },
  { key: 'remark', header: '조치사항(Hành động đã thực hiện)', width: 40 },
  { key: 'iamgeNG', header: 'Hình Ảnh' },
];
export const formatNumberWithCommas = (text) => {
  if (!text) {
    return '';
  }
  const numericValue = `${text}`.replace(/,/g, ''); // Remove existing commas before formatting
  if (numericValue) {
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue;
  }
};
