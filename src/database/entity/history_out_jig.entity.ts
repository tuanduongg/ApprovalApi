import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OutputJig } from './output_jig.entity';

@Entity()
export class HistoryOutJig {
  @PrimaryGeneratedColumn('increment')
  historyId: number;

  @Column({ nullable: true })
  historyType: string;

  @Column({ nullable: true })
  historyTime: Date;

  @Column({ nullable: true })
  historyUsername: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  historyRemark: string;

  @ManyToOne(() => OutputJig, (ref) => ref.histories)
  @JoinColumn({ name: 'outputJigID', referencedColumnName: 'outputJigID' })
  outputJig: OutputJig;
}
