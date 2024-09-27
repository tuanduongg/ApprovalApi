import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CategoryConcept } from './category_concept.entity';
import { OutputJig } from './output_jig.entity';

@Entity()
export class ModelMold {
    @PrimaryGeneratedColumn('increment')
    modelID: number;

    @Column({ nullable: true })
    projectName: string;

    @Column({ nullable: true })
    type: string;

    @Column({ nullable: true })
    model: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    createAt: Date;
    @Column({ nullable: true })
    createBy: string;

    @Column({ nullable: true })
    updateAt: Date;
    @Column({ nullable: true })
    updateBy: string;

    @ManyToOne(() => CategoryConcept, (ref) => ref.modelMolds)
    @JoinColumn({ name: 'categoryId', referencedColumnName: 'categoryId' })
    category: CategoryConcept;

    @OneToMany(() => OutputJig, (ref) => ref.model)
    OutputJigs: ModelMold[];
}
