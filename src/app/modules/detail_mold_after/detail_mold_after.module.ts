import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailMoldAfterController } from './detail_mold_after.controller';
import { DetailMoldAfter } from 'src/database/entity/detail_mold_after.entity';
import { DetailMoldAfterService } from './detail_mold_after.service';

@Module({
  imports: [TypeOrmModule.forFeature([DetailMoldAfter])],
  controllers: [DetailMoldAfterController],
  providers: [DetailMoldAfterService],
  exports: [DetailMoldAfterService],
})
export class DetailMoldAfterModule {}
