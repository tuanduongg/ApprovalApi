import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DetailMoldBefore {
  @PrimaryGeneratedColumn('increment')
  beforeID: number;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  project: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  productName: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  asset: string;

  @Column({ nullable: true })
  cvt: string;

  @Column({ nullable: true })
  massProduct: string;

  @Column({ nullable: true })
  currentLocation: string;

  @Column({ nullable: true })
  date: Date;

  @Column({ nullable: true })
  createAt: Date;

  @Column({ nullable: true })
  createBy: string;

  @Column({ nullable: true })
  updateAt: Date;

  @Column({ nullable: true })
  updateBy: string;
}
