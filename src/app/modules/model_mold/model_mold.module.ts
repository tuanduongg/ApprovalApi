import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelMold } from 'src/database/entity/model_mold.entity';
import { ModelMoldController } from './model_mold.controller';
import { ModelMoldService } from './model_mold.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModelMold])],
  controllers: [ModelMoldController],
  providers: [ModelMoldService],
  exports: []
})
export class ModelMoldModule { }
