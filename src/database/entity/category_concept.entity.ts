import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Concept } from './concept.entity';
import { ReportQC } from './report_qc.entity';
import { ModelMold } from './model_mold.entity';

@Entity()
export class CategoryConcept {
  @PrimaryGeneratedColumn('increment')
  categoryId: number;

  @Column({ nullable: true })
  categoryName: string;

  @OneToMany(() => Concept, (ref) => ref.category)
  modelMolds: ModelMold[];
  
  @OneToMany(() => Concept, (ref) => ref.category)
  concepts: Concept[];

  @OneToMany(() => ReportQC, (ref) => ref.category)
  reportQC: ReportQC[];
}
