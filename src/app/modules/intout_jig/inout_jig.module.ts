import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InOutJIGController } from './inout_jig.controller';
import { InOutJIGService } from './inout_jig.service';
import { InOutJIG } from 'src/database/entity/inout_jig.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InOutJIG])],
  controllers:[InOutJIGController],
  providers: [InOutJIGService],
  exports: [InOutJIGService]
})
export class InOutJIGModule {}
