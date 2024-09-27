import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/database/entity/company.entity';
import { ModelMold } from 'src/database/entity/model_mold.entity';
import { OutputJig } from 'src/database/entity/output_jig.entity';
import { Repository } from 'typeorm';
import { CompanyService } from '../company/company.service';

@Injectable()
export class OutputJigService {
  private ARR_PROP_OBJECT_COMPANY = [];
  constructor(
    @InjectRepository(OutputJig)
    private repository: Repository<OutputJig>,
    private readonly companyService: CompanyService
  ) {
    this.ARR_PROP_OBJECT_COMPANY = [
      "manufacturer",
      "shipArea",
      "massCompany",
      "modificationCompany",
      "wearingPlan",
    ];
  }

  async all(body, request, res) {
    // const {
    //   page,
    //   rowsPerPage,
    //   search
    // } = body;
    // const take = +rowsPerPage || 10;
    // const newPage = +page || 0;
    // const skip = newPage * take;
    const data = await this.repository.find({
      select: {
        outputJigID: true,
        moldNo: true,
        tryNo: true,
        shipMassCompany: true,
        shipDate: true,
        outputEdit: true,
        historyEdit: true,
        receivingCompleted: true,
        productionStatus: true,
        manufacturer: {
          companyID: true,
          companyCode: true,
          companyName: true,
        },
        shipArea: {
          companyID: true,
          companyCode: true,
          companyName: true,
        },
        massCompany: {
          companyID: true,
          companyCode: true,
          companyName: true,
        },
        modificationCompany: {
          companyID: true,
          companyCode: true,
          companyName: true,
        },
        wearingPlan: {
          companyID: true,
          companyCode: true,
          companyName: true,
        },
        model: {
          modelID: true,
          projectName: true,
          type: true,
          model: true,
          description: true,
          category: {
            categoryId: true,
            categoryName: true,
          }
        }
      },
      relations: ['manufacturer', 'shipArea', 'massCompany', 'modificationCompany', 'wearingPlan', 'model', 'model.category'],
      order: { model: { type: 'ASC' }, moldNo: 'ASC' }
    });
    return res.status(HttpStatus.OK).send(data);
  }


  async add(body, request, res) {
    const arrCodeFind = [];
    const objPropCodeFind = {};
    const flagCheckCode = [];
    this.ARR_PROP_OBJECT_COMPANY.map((prop) => {
      // nếu chỉ có code -> tìm id
      const companyCode = body[prop]?.companyCode?.trim();
      if (companyCode && !body[prop]?.companyID) {
        arrCodeFind.push(companyCode);
        objPropCodeFind[prop] = body[prop];
      }
    });
    const arrComFinded = await this.companyService.findByCode(arrCodeFind);
    Object.keys(objPropCodeFind)?.map((field) => {
      const codeItem = objPropCodeFind[field]?.companyCode?.trim();
      const find = arrComFinded.find((company) => (company.companyCode === codeItem));
      if (find) {
        objPropCodeFind[field]['companyID'] = find?.companyID;
        objPropCodeFind[field]['companyName'] = find?.companyName;
      } else {
        if (!flagCheckCode.includes(codeItem)) {
          flagCheckCode.push(codeItem)
        }
      }
    });
    if (flagCheckCode?.length > 0) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: `"${flagCheckCode.join(', ').replace(/, ([^,]*)$/, ' and $1')}"` + ' not existing!' })
    }

    const newBody = { ...body, ...objPropCodeFind };

    const newModel = new OutputJig();
    newModel.model = { modelID: newBody?.modelID } as ModelMold;
    newModel.moldNo = newBody?.moldNo;
    newModel.productionStatus = newBody?.productionStatus;
    if (newBody?.manufacturer?.companyID) {
      newModel.manufacturer = newBody?.manufacturer as Company;
    }
    if (newBody?.shipArea?.companyID) {
      newModel.shipArea = newBody?.shipArea as Company;
    }

    if (newBody?.massCompany?.companyID) {
      newModel.massCompany = newBody?.massCompany as Company;
    }

    if (newBody?.modificationCompany?.companyID) {
      newModel.modificationCompany = newBody?.modificationCompany as Company;
    }
    if (newBody?.wearingPlan?.companyID) {
      newModel.wearingPlan = newBody?.wearingPlan as Company;
    }

    newModel.shipDate = newBody?.shipDate;
    newModel.shipMassCompany = newBody?.shipMassCompany;
    newModel.outputEdit = newBody?.outputEdit;
    newModel.receivingCompleted = newBody?.receivingCompleted;


    newModel.tryNo = newBody?.tryNo?.trim();
    newModel.historyEdit = newBody?.historyEdit?.trim();
    newModel.createAt = new Date();
    newModel.createBy = request?.user?.userName;
    await this.repository.save(newModel);
    return res.status(HttpStatus.OK).send(newModel);
  }
  async update(body, request, res) {
    const newModel = await this.repository.findOne({ where: { outputJigID: body?.outputJigID } });
    if (newModel) {
      const arrCodeFind = [];
      const objPropCodeFind = {};
      const flagCheckCode = [];
      this.ARR_PROP_OBJECT_COMPANY.map((prop) => {
        // nếu chỉ có code -> tìm id
        const companyCode = body[prop]?.companyCode?.trim();
        if (companyCode && !body[prop]?.companyID) {
          arrCodeFind.push(companyCode);
          objPropCodeFind[prop] = body[prop];
        }
      });
      const arrComFinded = await this.companyService.findByCode(arrCodeFind);
      Object.keys(objPropCodeFind)?.map((field) => {
        const codeItem = objPropCodeFind[field]?.companyCode?.trim();
        const find = arrComFinded.find((company) => (company.companyCode === codeItem));
        if (find) {
          objPropCodeFind[field]['companyID'] = find?.companyID;
          objPropCodeFind[field]['companyName'] = find?.companyName;
        } else {
          if (!flagCheckCode.includes(codeItem)) {
            flagCheckCode.push(codeItem)
          }
        }
      });
      if (flagCheckCode?.length > 0) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: `"${flagCheckCode.join(', ').replace(/, ([^,]*)$/, ' and $1')}"` + ' not existing!' })
      }

      const newBody = { ...body, ...objPropCodeFind };
      newModel.model = { modelID: newBody?.modelID } as ModelMold;
      newModel.moldNo = newBody?.moldNo;
      newModel.productionStatus = newBody?.productionStatus;
      if (newBody?.manufacturer?.companyID && newBody?.manufacturer?.companyCode) {
        newModel.manufacturer = newBody?.manufacturer as Company;
      } else {
        newModel.manufacturer = null;

      }
      if (newBody?.shipArea?.companyID && newBody?.shipArea?.companyCode) {
        newModel.shipArea = newBody?.shipArea as Company;
      } else {
        newModel.shipArea = null;

      }

      if (newBody?.massCompany?.companyID && newBody?.massCompany?.companyCode) {
        newModel.massCompany = newBody?.massCompany as Company;
      } else {
        newModel.massCompany = null;

      }

      if (newBody?.modificationCompany?.companyID && newBody?.modificationCompany?.companyCode) {
        newModel.modificationCompany = newBody?.modificationCompany as Company;
      } else {
        newModel.modificationCompany = null;

      }
      if (newBody?.wearingPlan?.companyID && newBody?.wearingPlan?.companyCode) {
        newModel.wearingPlan = newBody?.wearingPlan as Company;
      } else {
        newModel.wearingPlan = null;

      }

      newModel.shipDate = newBody?.shipDate;
      newModel.shipMassCompany = newBody?.shipMassCompany;
      newModel.outputEdit = newBody?.outputEdit;
      newModel.receivingCompleted = newBody?.receivingCompleted;


      newModel.tryNo = newBody?.tryNo?.trim();
      newModel.historyEdit = newBody?.historyEdit?.trim();
      newModel.updateAt = new Date();
      newModel.updateBy = request?.user?.userName;
      await this.repository.save(newModel);
      return res.status(HttpStatus.OK).send(newModel);
    }
    return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Not found record!' });
  }

  async delete(body, request, res) {
    const { outputJigID } = body;
    if (outputJigID) {
      await this.repository.delete({ outputJigID });
      return res.status(HttpStatus.OK).send({ message: 'Delete successful!' });
    }
    return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Not found record!' });

  };
}
