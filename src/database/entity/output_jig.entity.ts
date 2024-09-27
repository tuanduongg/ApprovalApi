import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './company.entity';
import { ModelMold } from './model_mold.entity';

@Entity()
export class OutputJig {
    @PrimaryGeneratedColumn('increment')
    outputJigID: number;

    @Column({ nullable: true })
    moldNo: string;

    @Column({ nullable: true })
    tryNo: string;

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
    outputEdit: Date;

    @ManyToOne(() => Company, { nullable: true })
    modificationCompany: Company;

    @Column({ nullable: true })
    historyEdit: string;

    @Column({ nullable: true, type: Date })
    receivingCompleted: Date;

    @ManyToOne(() => Company, { nullable: true })
    wearingPlan: Company;

    @Column({ nullable: true })
    productionStatus: string;

    @Column({ nullable: true })
    createAt: Date;

    @Column({ nullable: true })
    createBy: string;

    @Column({ nullable: true })
    updateAt: Date;

    @Column({ nullable: true })
    updateBy: string;

    @ManyToOne(() => ModelMold, (ref) => ref.OutputJigs)
    @JoinColumn({ name: 'modelID', referencedColumnName: 'modelID' })
    model: ModelMold;

}
