import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/database/entity/company.entity';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers:[CompanyController],
  providers: [CompanyService],
  exports: [CompanyService]
})
export class CompanyModule {}
