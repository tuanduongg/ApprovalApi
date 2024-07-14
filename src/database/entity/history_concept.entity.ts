import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Concept } from './concept.entity';

@Entity()
export class HistoryConcept {
  @PrimaryGeneratedColumn('increment')
  historyId: number;

  @Column({ nullable: true })
  historyType: string;

  @Column({ nullable: true })
  historyTime: Date;

  @Column({ nullable: true })
  historyUsername: string;

  @Column({ nullable: true, type: 'text' })
  historyRemark: string;

  @ManyToOne(() => Concept, (ref) => ref.histories)
  @JoinColumn({ name: 'conceptId', referencedColumnName: 'conceptId' })
  concept: Concept
}
