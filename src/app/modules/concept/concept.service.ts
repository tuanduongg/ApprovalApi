import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concept } from 'src/database/entity/concept.entity';
import { Between, In, Like, Repository } from 'typeorm';
import * as zlib from 'zlib';
import * as fs from 'fs';
import * as stream from 'stream';
import * as path from 'path';
import { convertToDigits } from 'src/core/utils/helper';
import { FileConceptService } from '../file_concept/file_concept.service';
import { CategoryConcept } from 'src/database/entity/category_concept.entity';
import { User } from 'src/database/entity/user.entity';
import { HistoryConceptService } from '../history_concept/history_concept.service';

@Injectable()
export class ConceptService {
  constructor(
    @InjectRepository(Concept)
    private repository: Repository<Concept>,
    private readonly fileConceptService: FileConceptService,
    private readonly historyConceptService: HistoryConceptService,
  ) {}

  async all(res, request, body) {
    const {
      personName,
      categoryFilter,
      startDate,
      endDate,
      codeFilter,
      plNameFilter,
      modelFilter,
      productNameFilter,
    } = body;

    const whereOBJ = {
      regisDate: Between(startDate, endDate),
      code: Like(`%${codeFilter}%`),
      plName: Like(`%${plNameFilter}%`),
      modelName: Like(`%${modelFilter}%`),
      productName: Like(`%${productNameFilter}%`),
      category: { categoryId: In(categoryFilter) },
      user: { userId: In(personName) },
    };

    if (personName?.length > 0) {
      whereOBJ.user = { userId: In(personName) };
    } else {
      delete whereOBJ.user;
    }
    if (categoryFilter?.length > 0) {
      whereOBJ.category = { categoryId: In(categoryFilter) };
    } else {
      delete whereOBJ.category;
    }

    const data = await this.repository.find({
      where: whereOBJ,
      select: {
        conceptId: true,
        modelName: true,
        plName: true,
        code: true,
        productName: true,
        regisDate: true,
        status: true,
        category: {
          categoryName: true,
        },
        user: {
          fullName: true,
          userName: true,
        },
      },
      relations: ['category', 'user'],
    });
    const newData = data.map((item) => ({
      ...item,
      isMe: item?.user?.userName === request?.user?.userName,
    }));
    return res.status(HttpStatus.OK).send(newData);
  }
  async add(res, request, body, files) {
    const data = body?.data;
    const dataObj = JSON.parse(data);
    const concept = new Concept();
    if (dataObj?.category) {
      concept.category = new CategoryConcept().categoryId = dataObj.category;
    }
    concept.code = dataObj?.code;
    concept.modelName = dataObj?.modelName;
    concept.productName = dataObj?.productName;
    concept.regisDate = dataObj?.regisDate;
    concept.plName = dataObj?.plName;

    const user = new User();
    user.userId = request?.user?.userId;
    concept.user = user;
    await this.repository.save(concept);
    await this.historyConceptService.add(
      concept,
      {
        type: 'ADD',
        historyRemark: 'Add new',
      },
      request,
    );
    files?.map(async (file) => {
      await this.uploadAndCompressFile(file, concept);
    });
    return res.status(HttpStatus.OK).send(concept);
  }
  async uploadAndCompressFile(file: any, concept: Concept): Promise<boolean> {
    try {
      const randomFileName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const buffer = file.buffer; // Lấy buffer từ tệp tải lên
      const currentDate = new Date();
      const folderName = `${convertToDigits(currentDate.getDate())}${convertToDigits(currentDate.getMonth() + 1)}${currentDate.getFullYear()}`;
      const folder = 'uploads' + `/${folderName}`;
      const uploadDir = path.join(__dirname, folder);
      const fileName = `${randomFileName}.gz`;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
      }
      const compressedFilePath = path.join(uploadDir, fileName); // Đường dẫn để lưu tệp nén
      const pathToFile = folder + '/' + fileName;

      const gzip = zlib.createGzip(); // Tạo đối tượng gzip để nén
      const output = fs.createWriteStream(compressedFilePath); // Tạo luồng ghi cho tệp nén

      // Chuyển đổi buffer thành luồng đọc
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      // Xử lý khi hoàn thành quá trình nén
      output.on('close', async () => {
        const stats = fs.statSync(compressedFilePath); // Lấy thông tin tệp của tệp nén
        // const compressedSize = stats.size; // Lấy kích thước của tệp nén
        console.log('file save', {
          filePath: pathToFile, // Đường dẫn tới tệp nén
          originalName: Buffer.from(file.originalname, 'latin1').toString(
            'utf8',
          ), // Tên gốc của tệp
          mimeType: file.mimetype, // Loại MIME của tệp gốc
          size: file.size, // Kích thước của tệp gốc
          fileExtenstion: file?.originalname.split('.').pop(), // Kích thước của tệp nén
        });
        const fileSaved = await this.fileConceptService.add(
          [
            {
              filePath: pathToFile, // Đường dẫn tới tệp nén
              originalName: file.originalname, // Tên gốc của tệp
              mimeType: file.mimetype, // Loại MIME của tệp gốc
              size: file.size, // Kích thước của tệp gốc
              fileExtenstion: file?.originalname.split('.').pop(), // Kích thước của tệp nén
            },
          ],
          concept,
        ); // Lưu thông tin tệp mới vào cơ sở dữ liệu
      });

      bufferStream.pipe(gzip).pipe(output); // Truyền buffer qua gzip tới luồng ghi

      return true; // Trả về đường dẫn tới tệp nén
    } catch (error) {
      console.error('Error during file upload and compression:', error); // Ghi bất kỳ lỗi nào xảy ra
      throw new HttpException(
        'Failed to upload and compress file. Please try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); // Ném ra một ngoại lệ HTTP nếu có lỗi xảy ra
    }
  }
}
