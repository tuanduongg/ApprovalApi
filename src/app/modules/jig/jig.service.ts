import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JIG } from 'src/database/entity/jig.entity';
import { ILike, Repository } from 'typeorm';
import { InOutJIGService } from '../intout_jig/inout_jig.service';
import { InOutJIG } from 'src/database/entity/inout_jig.entity';

@Injectable()
export class JIGService {
  constructor(
    @InjectRepository(JIG)
    private repository: Repository<JIG>,
    private readonly inOutJigService: InOutJIGService,
  ) { }
  async create(body, request, res) {
    const dataStr = body?.data;
    const dataObj = JSON.parse(dataStr);

    const {
      assetNo,
      category,
      model,
      productName,
      version,
      edition,
      SFC,
      code,
      company,
      weight,
      size,
      inputDate,
      maker,
      type,
      material,
      location,
    } = dataObj?.valueForm;
    const userFind = await this.repository.findOne({
      where: { assetNo: ILike(assetNo) },
    });
    if (userFind) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Asset No. existed!' });
    } else {
      const jigNew = new JIG();
      jigNew.assetNo = assetNo ?? '';
      jigNew.category = category ?? '';
      jigNew.model = model ?? '';
      jigNew.productName = productName ?? '';
      jigNew.version = version ?? null;
      jigNew.edition = edition ?? null;
      jigNew.SFC = SFC ?? '';
      jigNew.code = code ?? '';
      jigNew.company = company ?? '';
      jigNew.weight = weight ?? '';
      jigNew.size = size ?? '';
      jigNew.maker = maker ?? '';
      jigNew.type = type ?? '';
      jigNew.material = material ?? '';
      jigNew.createAt = new Date();
      jigNew.createBy = request?.user?.userName;

      // jigNew.inputDate = inputDate ?? null;
      // jigNew.location = location ?? '';
      await this.repository.save(jigNew);
      await this.inOutJigService.create({
        date: inputDate ?? new Date(),
        isFirstInput: true,
        jig: jigNew,
        location: location,
        type: 'IN',
      } as InOutJIG);

      return res.status(HttpStatus.OK).send(jigNew);
    }
  }
  async update(body, request, res) {
    const dataStr = body?.data;
    const dataObj = JSON.parse(dataStr);
    const arrDeleteInout: any = [],
      arrInsertInout: any = [];

    const {
      jigId,
      assetNo,
      category,
      model,
      productName,
      version,
      edition,
      SFC,
      code,
      company,
      weight,
      size,
      maker,
      type,
      material,
    } = dataObj?.valueForm;
    if (!jigId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'not found JIG ID!' });
    }
    const find = await this.repository.findOne({
      where: { jigId: jigId },
    });
    find.assetNo = assetNo ?? '';
    find.category = category ?? '';
    find.model = model ?? '';
    find.productName = productName ?? '';
    find.version = version ?? null;
    find.edition = edition ?? null;
    find.SFC = SFC ?? '';
    find.code = code ?? '';
    find.company = company ?? '';
    find.weight = weight ?? '';
    find.size = size ?? '';
    find.maker = maker ?? '';
    find.type = type ?? '';
    find.material = material ?? '';
    find.updateAt = new Date();
    find.updateBy = request?.user?.userName;
    if (dataObj?.arrInOutJig?.length > 0) {
      dataObj?.arrInOutJig?.map((inOutItem) => {
        if (inOutItem?.isShow) {
          //add
          arrInsertInout.push({ ...inOutItem, jig: find });
        } else {
          //delete
          if (inOutItem?.inOutId) {
            arrDeleteInout.push(inOutItem?.inOutId);
          }
        }
      });
    }
    try {
      await this.inOutJigService.updateByJig(arrDeleteInout, arrInsertInout);
      await this.repository.save(find);
      return res.status(HttpStatus.OK).send(find);
    } catch (error) {
      console.log('error jig.service.ts at line 144:', error);

      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Error while saving!' });
    }
  }
  async all(request, body, res) {
    const { search, page, rowsPerPage } = body;
    const take = +rowsPerPage || 10;
    const newPage = +page || 0;
    const skip = newPage * take;

    const data = await this.repository
      .createQueryBuilder('jig')
      .leftJoinAndSelect(
        'jig.inOutJig',
        'inOutJig',
        'inOutJig.isFirstInput = :isFirstInput',
        { isFirstInput: true },
      )
      .where('jig.assetNo LIKE :search', { search: `%${search}%` })
      .orWhere('jig.category LIKE :search', { search: `%${search}%` })
      .orWhere('jig.code LIKE :search', { search: `%${search}%` })
      .orWhere('jig.company LIKE :search', { search: `%${search}%` })
      .orWhere('jig.productName LIKE :search', { search: `%${search}%` })
      .orderBy('jig.createAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
    return res?.status(200).send(data);
  }

  async findByAssetNo(body, request, res) {
    const assetNo = body?.assetNo;
    if (assetNo) {
      const data = await this.repository.findOne({
        where: { assetNo: assetNo },
        relations: ['inOutJig'],
      });

      if (data) {
        return res.status(HttpStatus.OK).send(data);
      }
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'not found record!' });
  }
  async delete(body, request, res) {
    const jigId = body?.jigId;
    if (jigId) {
      const data = await this.repository.findOneBy({ jigId: jigId });
      if (data) {
        await this.inOutJigService.deleteByJig(data);
        await this.repository.remove(data);
        return res.status(HttpStatus.OK).send(data);
      }
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'Not found record!' });
  }
}
