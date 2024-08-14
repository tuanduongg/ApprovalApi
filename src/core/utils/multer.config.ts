import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { getExtenstionFromOriginalName } from './helper';

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
      const day = String(now.getDate()).padStart(2, '0');
      const uploadPath = path.join(
        process.env.UPLOAD_FOLDER || './public',
        'uploads',
        `${day}${month}${year}`,
      );
      // Tạo thư mục nếu chưa tồn tại
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
      const extension = getExtenstionFromOriginalName(file.originalname);
      const fileName = `${uniqueSuffix}${extension ? '.' + extension : ''}`;
      cb(null, fileName);
    },
  }),
};
