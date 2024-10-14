import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('increment')
  companyID: number;

  @Column({ nullable: true, unique: true })
  companyCode: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  createAt: Date;
  
  @Column({ nullable: true })
  createBy: string;

  @Column({ nullable: true })
  updateAt: Date;
  
  @Column({ nullable: true })
  updateBy: string;
}
