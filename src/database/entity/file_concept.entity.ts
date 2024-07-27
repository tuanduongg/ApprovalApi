import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Concept } from './concept.entity';

@Entity()
export class FileConcept {
  @PrimaryGeneratedColumn('increment')
  fileId: number;

  @Column({ nullable: true })
  fileName: string;


  @Column({ nullable: true })
  fileExtenstion: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true, default: 1 })
  ECN: number;
  
  @Column({ nullable: true })
  uploadAt: Date;

  @ManyToOne(() => Concept, (ref) => ref.files)
  @JoinColumn({ name: 'conceptId', referencedColumnName: 'conceptId' })
  concept: Concept;
}
