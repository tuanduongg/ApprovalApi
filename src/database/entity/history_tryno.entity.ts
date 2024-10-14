import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OutputJig } from './output_jig.entity';
import { Company } from './company.entity';

@Entity()
export class HistoryTryNo {
  @PrimaryGeneratedColumn('increment')
  historyTryNoId: number;

  @Column({ nullable: true })
  tryNum: number;

  @Column({ nullable: true, default: false })
  currentTry: boolean;

  @ManyToOne(() => Company, { nullable: true })
  modificationCompany: Company;
  
  @Column({ nullable: true, type: Date })
  receivingCompleted: Date;

  @Column({ nullable: true, type: Date })
  outputEdit: Date;

  @Column({ nullable: true, type: Date })
  wearingPlan: Date;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  remark: string;

  //1-phát triển
  //2-sản xuất
  @Column({ nullable: true })
  departEdit: number;

  @Column({ nullable: true })
  createAt: Date;

  @Column({ nullable: true })
  createBy: string;

  @Column({ nullable: true })
  updateAt: Date;

  @Column({ nullable: true })
  updateBy: string;

  @ManyToOne(() => OutputJig, (ref) => ref.historyTryNo)
  @JoinColumn({ name: 'outputJigID', referencedColumnName: 'outputJigID' })
  outputJig: OutputJig;
}
