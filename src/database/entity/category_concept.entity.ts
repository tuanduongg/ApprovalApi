import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Concept } from './concept.entity';

@Entity()
export class CategoryConcept {
  @PrimaryGeneratedColumn('increment')
  categoryId: number;

  @Column({ nullable: true })
  categoryName: string;

  @OneToMany(() => Concept, (ref) => ref.category)
  concepts: Concept[];
}
