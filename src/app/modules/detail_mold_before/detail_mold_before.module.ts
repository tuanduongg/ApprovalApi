import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailMoldBefore } from 'src/database/entity/detail_mold_before.entity';
import { DetailMoldBeforeService } from './detail_mold_before.service';
import { DetailMoldBeforeController } from './detail_mold_before.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DetailMoldBefore])],
  controllers:[DetailMoldBeforeController],
  providers: [DetailMoldBeforeService],
  exports: [DetailMoldBeforeService]
})
export class DetailMoldBeforeModule {}
