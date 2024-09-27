import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryConcept } from 'src/database/entity/category_concept.entity';
import { ModelMold } from 'src/database/entity/model_mold.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ModelMoldService {
  constructor(
    @InjectRepository(ModelMold)
    private repository: Repository<ModelMold>,
  ) { }

  async all(body, request, res) {
    const {
      page,
      rowsPerPage,
      search
    } = body;
    const take = +rowsPerPage || 10;
    const newPage = +page || 0;
    const skip = newPage * take;
    const [data, total] = await this.repository.findAndCount({
      where: [
        {
          projectName: Like(`%${search}%`)
        },
        {
          type: Like(`%${search}%`)
        },
        {
          model: Like(`%${search}%`)
        },
        {
          description: Like(`%${search}%`)
        },
      ],
      relations: ['category'],
      take: take,
      skip: skip,
      order: { createAt: 'DESC' }
    });
    return res.status(HttpStatus.OK).send({ data, total });
  }


  async add(body, request, res) {
    const {
      project,
      type,
      model,
      category,
      description,
    } = body;
    const newModel = new ModelMold();
    newModel.category = { categoryId: category } as CategoryConcept;
    newModel.type = type?.trim();
    newModel.model = model?.trim();
    newModel.description = description?.trim();
    newModel.projectName = project?.trim();
    newModel.createAt = new Date();
    newModel.createBy = request?.user?.userName;
    await this.repository.save(newModel);
    return res.status(HttpStatus.OK).send(newModel);
  }
  async update(body, request, res) {
    const {
      modelID,
      project,
      type,
      model,
      category,
      description,
    } = body;

    const newModel = await this.repository.findOne({ where: { modelID } });
    if (newModel) {
      newModel.category = { categoryId: category } as CategoryConcept;
      newModel.type = type?.trim();
      newModel.model = model?.trim();
      newModel.description = description?.trim();
      newModel.projectName = project?.trim();
      newModel.updateAt = new Date();
      newModel.updateBy = request?.user?.userName;
      await this.repository.save(newModel);
      return res.status(HttpStatus.OK).send(newModel);
    }
    return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Not found record!' });
  }
}
