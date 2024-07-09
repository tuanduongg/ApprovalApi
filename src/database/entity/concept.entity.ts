import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CategoryConcept } from './category_concept.entity';
import { HistoryConcept } from './history_concept.entity';
import { FileConcept } from './file_concept.entity';

@Entity()
export class Concept {
  @PrimaryGeneratedColumn('increment')
  conceptId: number;

  @Column({ nullable: true })
  modelName: string;

  @Column({ unique: true })
  plName: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  productName: string;
  
  @Column({ nullable: true })
  regisDate: string;
  
  @Column({ nullable: true })
  registrator: string;

  @Column({ nullable: true })
  status: string;


  @ManyToOne(() => CategoryConcept, (ref) => ref.concepts)
  @JoinColumn({name : 'categoryId', referencedColumnName: 'categoryId'})
  category: CategoryConcept

  @OneToMany(() => HistoryConcept, (ref) => ref.concepts)
  histories: HistoryConcept[];

  @OneToMany(() => FileConcept, (ref) => ref.concept)
  files: FileConcept[];


}
