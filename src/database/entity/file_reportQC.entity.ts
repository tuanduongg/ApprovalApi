import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReportQC } from './report_qc.entity';

@Entity()
export class FileReportQC {
  @PrimaryGeneratedColumn('uuid')
  fileId: number;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  fileExtenstion: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ nullable: true })
  fileUrl: string;

  //Image,File Request, File Reply
  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true, type: Date })
  uploadAt: Date;

  @Column({ nullable: true })
  uploadBy: string;

  @ManyToOne(() => ReportQC, (ref) => ref.media)
  @JoinColumn({ name: 'reportId', referencedColumnName: 'reportId' })
  reportQC: ReportQC;
}
