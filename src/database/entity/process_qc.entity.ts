import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ReportQC } from './report_qc.entity';

@Entity()
export class ProcessQC {
  @PrimaryGeneratedColumn('increment')
  processId: number;

  @Column({ nullable: true })
  processName: string;

  @OneToMany(() => ReportQC, (ref) => ref.processQC)
  reportQCs: ReportQC[];
}
