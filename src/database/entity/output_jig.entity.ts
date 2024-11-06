import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Company } from './company.entity';
import { ModelMold } from './model_mold.entity';
import { HistoryOutJig } from './history_out_jig.entity';
import { HistoryTryNo } from './history_tryno.entity';

@Entity()
export class OutputJig {
  @PrimaryGeneratedColumn('increment')
  outputJigID: number;

  @Column({ nullable: true })
  moldNo: string;

  @ManyToOne(() => Company, { nullable: true })
  manufacturer: Company;

  @ManyToOne(() => Company, { nullable: true })
  shipArea: Company;

  @ManyToOne(() => Company, { nullable: true })
  massCompany: Company;

  @Column({ nullable: true, type: Date })
  shipMassCompany: Date;

  @Column({ nullable: true, type: Date })
  shipDate: Date;
 

  @Column({ nullable: true, type: Date })
  developDate: Date;
 

  @Column({ nullable: true })
  productionStatus: string;

  @Column({ nullable: true })
  createAt: Date;

  @Column({ nullable: true })
  createBy: string;

  @Column({ nullable: true })
  deleteAt: Date;

  @Column({ nullable: true })
  deleteBy: string;

  @ManyToOne(() => ModelMold, (ref) => ref.OutputJigs)
  @JoinColumn({ name: 'modelID', referencedColumnName: 'modelID' })
  model: ModelMold;

  @OneToMany(() => HistoryOutJig, (ref) => ref.outputJig, { cascade: ['insert', 'update'] })
  histories: HistoryOutJig[];

  @OneToMany(() => HistoryTryNo, (ref) => ref.outputJig, { cascade: ['insert', 'update'] })
  historyTryNo: HistoryTryNo[];
}
