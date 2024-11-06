import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DetailMoldAfter {
  @PrimaryGeneratedColumn('increment')
  afterID: number;

  @Column({ nullable: true })
  no: string;

  @Column({ nullable: true })
  modification: string;

  @Column({ nullable: true })
  schedule: string;

  @Column({ nullable: true })
  detailEdit: string;

  @Column({ nullable: true })
  division: string;

  

  @Column({ nullable: true })
  createAt: Date;

  @Column({ nullable: true })
  createBy: string;

  @Column({ nullable: true })
  updateAt: Date;

  @Column({ nullable: true })
  updateBy: string;
}
