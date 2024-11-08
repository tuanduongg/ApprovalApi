import { Global, Module } from '@nestjs/common';
import { ListAPIService } from './list_api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListAPI } from 'src/database/entity/list_api.entity';
import { ListAPIController } from './list_api.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ListAPI])],
  controllers: [ListAPIController],
  providers: [ListAPIService],
  exports: [ListAPIService],
})
export class ListAPIModule { }
