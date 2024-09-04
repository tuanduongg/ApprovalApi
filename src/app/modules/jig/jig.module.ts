import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JIGController } from './jig.controller';
import { JIG } from 'src/database/entity/jig.entity';
import { JIGService } from './jig.service';
import { InOutJIGModule } from '../intout_jig/inout_jig.module';

@Module({
  imports: [TypeOrmModule.forFeature([JIG]),InOutJIGModule],
  controllers:[JIGController],
  providers: [JIGService],
  exports: [JIGService]
})
export class JIGModule {}
