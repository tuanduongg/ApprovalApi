import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutputJig } from 'src/database/entity/output_jig.entity';
import { OutputJigController } from './output_jig.controller';
import { OutputJigService } from './output_jig.service';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([OutputJig]),CompanyModule],
  controllers: [OutputJigController],
  providers: [OutputJigService],
  exports: []
})
export class OutputJigModule { }
