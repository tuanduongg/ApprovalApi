import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JIG } from './jig.entity';

@Entity()
export class InOutJIG {
  @PrimaryGeneratedColumn('increment')
  inOutId: number;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true, type: Date })
  date: Date;

  @Column({ default: false })
  isFirstInput: boolean;

  @Column({ default: null })
  type: string;

  @ManyToOne(() => JIG, (ref) => ref.inOutJig)
  @JoinColumn({ name: 'jigId', referencedColumnName: 'jigId' })
  jig: JIG;
}
