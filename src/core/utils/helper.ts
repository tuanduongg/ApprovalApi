import * as bcrypt from 'bcrypt';
import { readdir, stat } from 'fs/promises';
import * as path from 'path';

import * as fs from 'fs';
import dayjs from 'dayjs';
import { Between } from 'typeorm';

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
function isDate(value) {
  return value instanceof Date;
}

export function addZero(num) {
  const numInt = parseInt(num);
  return (numInt < 10 ? '0' : '') + numInt;
}
export const formatDateFromDB = (dateString, showTime = true) => {
  if (!dateString) {
    return '';
  }
  // Tạo một đối tượng Date từ chuỗi
  let date = null;
  if (isDate(dateString)) {
    date = dateString;
  } else {
    date = new Date(dateString);
  }
  // Lấy các thành phần ngày
  const day = date.getDate();
  const month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0 nên cần cộng thêm 1
  const year = date.getFullYear();
  if (!showTime) {
    return year + '/' + addZero(month) + '/' + addZero(day);
  }
  // Lấy các thành phần thời gian
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Hàm để thêm số 0 trước các giá trị nhỏ hơn 10
  // Tạo chuỗi định dạng
  return (
    addZero(hours) +
    ':' +
    addZero(minutes) +
    ' ' +
    year +
    '/' +
    addZero(month) +
    '/' +
    addZero(day)
  );
};

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

// export const handleFiles = async (
//   files: Express.Multer.File[],
//   folderName: string = '',
// ) => {
//   if (!files || files?.length <= 0) {
//     return [];
//   }

//   const arrFile = files.map((file) => {
//     if (file) {
//       try {
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
//         const day = String(now.getDate()).padStart(2, '0');
//         const folderUpload = path.join(
//           folderName ? folderName : 'uploads',
//           `${day}${month}${year}`,
//         );
//         const uploadPath = path.join(
//           process.env.UPLOAD_FOLDER || './public',
//           folderUpload,
//         );
//         // Tạo thư mục nếu chưa tồn tại
//         fs.mkdirSync(uploadPath, { recursive: true });

//         const uniqueSuffix = Array(32)
//           .fill(null)
//           .map(() => Math.round(Math.random() * 16).toString(16))
//           .join('');
//         const extension = getExtenstionFromOriginalName(file?.originalname);
//         const fileName = `${uniqueSuffix}${extension ? '.' + extension : ''}`;
//         const urlStoreDB = path.join(folderUpload, fileName);
//         const targetPath = path.join(uploadPath, fileName);

//         const readableStream = fs.createReadStream(file?.path);
//         const writableStream = fs.createWriteStream(targetPath);

//         readableStream.pipe(writableStream);

//         readableStream.on('error', (error) => {
//           console.error('Error reading file:', error);
//           fs.stat(file?.path, function (err, stats) {
//             if (err) {
//               return console.error(err);
//             }
//             fs.unlinkSync(file?.path); // Xóa tệp tạm thời nếu có lỗi
//           });
//         });

//         writableStream.on('error', (error) => {
//           console.error('Error writing file:', error);
//           fs.stat(file?.path, function (err, stats) {
//             if (err) {
//               return console.error(err);
//             }
//             fs.unlinkSync(file?.path); // Xóa tệp tạm thời nếu có lỗi
//           });
//           fs.stat(file?.path, function (err, stats) {
//             if (err) {
//               return console.error(err);
//             }
//             fs.unlinkSync(targetPath); // Xóa tệp đích nếu có lỗi
//           });
//         });

//         writableStream.on('finish', () => {
//           fs.stat(file?.path, function (err, stats) {
//             if (err) {
//               return console.error(err);
//             }
//             fs.unlinkSync(file?.path); // Xóa tệp tạm thời khi barn ghi hoan tat
//           });
//         });
//         return { ...file, urlStoreDB };
//       } catch (error) {
//         console.error('Error handling file:', error);
//         throw error;
//       }
//     }
//   });
//   return arrFile;
// };


// new function handle files
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
        try {
          fs.mkdirSync(uploadPath, { recursive: true });
        } catch (mkdirErr) {
          console.error(`Error creating directory ${uploadPath}:`, mkdirErr);
          throw mkdirErr; // Dừng lại nếu không thể tạo thư mục
        }

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

        // Xử lý lỗi khi đọc file
        readableStream.on('error', (error) => {
          console.error('Error reading file:', error);
          try {
            if (fs.existsSync(file?.path)) {
              fs.unlinkSync(file?.path); // Xóa tệp tạm thời nếu có lỗi
            }
          } catch (unlinkErr) {
            console.error(`Error deleting temporary file ${file?.path}:`, unlinkErr);
          }
        });

        // Xử lý lỗi khi ghi file
        writableStream.on('error', (error) => {
          console.error('Error writing file:', error);
          try {
            if (fs.existsSync(file?.path)) {
              fs.unlinkSync(file?.path); // Xóa tệp tạm thời nếu có lỗi
            }
            if (fs.existsSync(targetPath)) {
              fs.unlinkSync(targetPath); // Xóa tệp đích nếu có lỗi
            }
          } catch (unlinkErr) {
            console.error(`Error deleting file ${file?.path} or ${targetPath}:`, unlinkErr);
          }
        });

        // Hoàn thành quá trình ghi tệp
        writableStream.on('finish', () => {
          try {
            if (fs.existsSync(file?.path)) {
              fs.unlinkSync(file?.path); // Xóa tệp tạm thời sau khi ghi hoàn tất
              console.log(`Successfully deleted temporary file: ${file?.path}`);
            }
          } catch (unlinkErr) {
            console.error(`Error deleting temporary file ${file?.path}:`, unlinkErr);
          }
        });

        return { ...file, urlStoreDB };
      } catch (error) {
        console.error('Error handling file:', error);
        throw error; // Đẩy lỗi ra ngoài nếu không thể xử lý tệp
      }
    }
  });
  return arrFile;
};


export function isDateDifferent(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() !== d2.getFullYear() ||
    d1.getMonth() !== d2.getMonth() ||
    d1.getDate() !== d2.getDate()
  );
}
// const getExtenstionFromOriginalName = (originalname: string) => {
//   const ext = originalname.split('.').pop();
//   return ext ? ext : '';
// };
export const getStatusMoldName = (status) => {
  switch (status) {
    case 'DEV':
      return '개발중';
    case 'USE':
      return '양산중';
    case 'STOP':
      return '사용중지';
    case 'RISK':
      return 'Risk양산';
    case 'EDIT':
      return '양산수정';
    case 'DEV_EDIT':
      return '개발수정';
    default:
      return '';
  }
};

export const checkStatusOnChange = (oldStatus: string, newStatus: string) => {
  if (oldStatus === 'DEV_EDIT' && newStatus === 'DEV') {
    return 1; //phat trien
  }
  const arr = ['USE', 'RISK', 'DEV'];
  if (oldStatus === 'EDIT' && arr.includes(newStatus)) {
    return 2; //san xuat
  }
  return 0;
};

export const LIST_COL_MOLD_REPORT_ID = [
  { header: 'Category', key: 'category', width: 10 },
  { header: 'Project', key: 'project', width: 10 },
  { header: ' 구분', key: 'type', width: 10 },
  { header: 'Model', key: 'model', width: 10 },
  { header: 'Description', key: 'description', width: 28 },
  { header: 'Mold No.', key: 'moldNo', width: 10 },
  { header: '제작업체(NSX)', key: 'manufacturer', width: 20 },
  { header: '발송지역(Nơi VC)', key: 'shipArea', width: 20 },
  {
    header: '출고 계획(Thời gian)',
    key: 'shipDate',

    width: 20,
  },
  { header: '양산업체(Cty SX)', key: 'massCompany', width: 20 },
  {
    header: '양산업체입고(Thời gian)',
    key: 'shipMassCompany',

    width: 25,
  },
  { header: '수정업체(Nơi sửa)', key: 'modificationCompany', width: 20 },
  {
    header: '수리 출고(Xuất kho sửa)',
    key: 'outputEdit',

    width: 25,
  },
  { header: '입고 계획(K.Hoạch xong)', key: 'wearingPlan', width: 20 },
  {
    header: '입고 완료(T.Tế xong)',
    key: 'receivingCompleted',

    width: 20,
  },
  { header: 'TRY NO.', key: 'tryNo', width: 10 },
  { header: '수정내역(Nội dung sửa)', key: 'historyEdit', width: 30 },
  { header: '수정', key: 'departEdit', width: 20 },
];

export function getDepartmentEditMold(num: number) {
  let text = '';
  switch (
  num //phat trien
  ) {
    case 1:
      text = '개발수정';

      break;
    case 2: // san xuat
      text = '양산수정';
      break;

    default:
      break;
  }
  return text;
}
export const LIST_COL_HISTORY = [
  { header: '#', key: 'index', width: 10 },
  { header: 'Type', key: 'type', width: 10 },
  { header: 'User', key: 'user', width: 10 },
  { header: 'Time', key: 'time', width: 28 },
  { header: 'Content', key: 'content', width: 20 },

];
export const LIST_COL_MOLD_REPORT = [
  { header: 'Category', key: 'category', width: 10 },
  { header: 'Project', key: 'project', width: 10 },
  { header: ' 구분', key: 'type', width: 10 },
  { header: 'Model', key: 'model', width: 10 },
  { header: 'Description', key: 'description', width: 28 },
  { header: 'Mold No.', key: 'moldNo', width: 10 },
  { header: '제작업체(NSX)', key: 'manufacturer', width: 20 },
  { header: '발송지역(Nơi VC)', key: 'shipArea', width: 20 },
  {
    header: '출고 계획(Thời gian)',
    key: 'shipDate',

    width: 20,
  },
  { header: '양산업체(Cty SX)', key: 'massCompany', width: 20 },
  {
    header: '양산업체입고(Thời gian)',
    key: 'shipMassCompany',

    width: 25,
  },
  { header: '수정업체(Nơi sửa)', key: 'modificationCompany', width: 20 },
  {
    header: '수리 출고(Xuất kho sửa)',
    key: 'outputEdit',

    width: 25,
  },
  { header: '입고 계획(K.Hoạch xong)', key: 'wearingPlan', width: 20 },
  {
    header: '입고 완료(T.Tế xong)',
    key: 'receivingCompleted',

    width: 20,
  },
  { header: 'TRY NO.', key: 'tryNo', width: 10 },
  { header: '수정내역(Nội dung sửa)', key: 'historyEdit', width: 30 },
  { header: '양산적용(Trạng thái)', key: 'productionStatus', width: 25 },
];

export const LIST_COL_REPORT_QC = [
  { key: 'category', header: 'Category', width: 15 },
  { key: 'model', header: 'Model', width: 10 },
  { key: 'plName', header: 'PL/Name', width: 10 },
  { key: 'code', header: 'Code', width: 17 },
  { key: 'item', header: 'Item', width: 10 },
  { key: 'shift', header: 'Shift', width: 10 },
  { key: 'week', header: 'Week', width: 8 },
  { key: 'time', header: 'Date', width: 15 },
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
// TypeORM Query Operators
export const BetweenDates = (
  dateFrom: Date | string,
  dateTo: Date | string,
) => {
  const parsedDateFrom = dayjs(dateFrom); // Chuyển đổi chuỗi hoặc Date thành đối tượng dayjs
  const parsedDateTo = dayjs(dateTo); // Chuyển đổi chuỗi hoặc Date thành đối tượng dayjs
  const from = parsedDateFrom.startOf('day').format('YYYY-MM-DD HH:mm:ss'); // 00:00:00
  const to = parsedDateTo.endOf('day').format('YYYY-MM-DD HH:mm:ss'); // 23:59:59

  return Between(from, to);
};


export const getAllFilesInFolder = function (dirPath: string, arrayOfFiles?: Array<any>) {
  try {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = getAllFilesInFolder(fullPath, arrayOfFiles); // Recursively get files in subfolders
      } else {
        arrayOfFiles.push(fullPath); // Add the file with full path
      }
    });
    return arrayOfFiles;
  } catch (error) {
    console.log('error getAllFilesInFolder():',error);
    return []
  }
};
