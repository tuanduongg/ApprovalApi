import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ProcessQC } from './process_qc.entity';
import { FileReportQC } from './file_reportQC.entity';
import { CategoryConcept } from './category_concept.entity';

@Entity()
export class ReportQC {
  @PrimaryGeneratedColumn('increment')
  reportId: number;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  plName: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  item: string;

  @Column({ nullable: true })
  shift: string;

  @Column({ nullable: true })
  week: number;

  @Column({ nullable: true, type: Date })
  time: Date;

  @Column({ nullable: true })
  nameNG: string;

  @Column({ nullable: true })
  percentageNG: string;

  //nhà cung cấp
  @Column({ nullable: true })
  supplier: string;

  //bên chịu trách nhiệm
  @Column({ nullable: true })
  attributable: string;

  //người đại diện
  @Column({ nullable: true })
  representative: string;

  //công nghệ gây nỗi
  @Column({ type: 'ntext', nullable: true })
  techNG: string;

  //giải pháp tạm thời
  @Column({ type: 'ntext', nullable: true })
  tempSolution: string;

  @Column({ nullable: true, type: Date })
  dateRequest: Date;

  @Column({ nullable: true, type: Date })
  dateReply: Date;

  //seowon stock
  @Column({ nullable: true })
  seowonStock: number;

  //vendor stock
  @Column({ nullable: true })
  vendorStock: number;

  //author
  @Column({ nullable: true })
  author: string;

  //create at
  @Column({ nullable: true })
  createAt: Date;

  @Column({ nullable: true })
  createBy: string;

  @Column({ nullable: true })
  updateAt: Date;

  @Column({ nullable: true })
  updateby: string;

  @Column({ nullable: true, default: null })
  deleteAt: Date;

  @Column({ nullable: true, default: null })
  deleteBy: string;

  //remark
  @Column({ type: 'ntext', nullable: true })
  remark: string;

  @ManyToOne(() => CategoryConcept, (ref) => ref.reportQC)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'categoryId' })
  category: CategoryConcept;

  // @ManyToOne(() => Concept, (ref) => ref.reportQC)
  // @JoinColumn({ name: 'conceptId', referencedColumnName: 'conceptId' })
  // concept: Concept;

  @ManyToOne(() => ProcessQC, (ref) => ref.reportQCs)
  @JoinColumn({ name: 'processId', referencedColumnName: 'processId' })
  processQC: ProcessQC;

  @OneToMany(() => FileReportQC, (ref) => ref.reportQC)
  media: FileReportQC[];
}
