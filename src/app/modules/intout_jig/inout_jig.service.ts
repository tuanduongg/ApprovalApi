import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InOutJIG } from 'src/database/entity/inout_jig.entity';
import { JIG } from 'src/database/entity/jig.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class InOutJIGService {
  constructor(
    @InjectRepository(InOutJIG)
    private repository: Repository<InOutJIG>,
  ) {}
  async create(inOutJig: InOutJIG) {
    return await this.repository.save(inOutJig);
  }

  async deleteByJig(jig: JIG) {
    return await this.repository.delete({ jig });
  }
  async findByJig(body, request, res) {
    const jigId = body?.jigId;
    if (jigId) {
      const data = await this.repository.find({
        where: { jig: { jigId } as JIG },
      });
      return res.status(HttpStatus.OK).send(data);
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'Not found record!' });
  }

  async updateByJig(arrDelete: [], arrInsert: []) {    
    const promissInsert = this.repository.save(arrInsert);
    const promissDelete = this.repository.delete({inOutId:In(arrDelete)});
    const promissAll = Promise.all([promissInsert, promissDelete]);
    return promissAll;
  }
}
