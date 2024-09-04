import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessQC } from 'src/database/entity/process_qc.entity';
import { ProcessQCController } from './process_qc.controller';
import { ProcessQCService } from './process_qc.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessQC])],
  controllers: [ProcessQCController],
  providers: [ProcessQCService],
  exports: [ProcessQCService],
})
export class ProcessQCModule {}
