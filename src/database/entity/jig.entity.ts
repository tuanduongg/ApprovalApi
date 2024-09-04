import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { InOutJIG } from './inout_jig.entity';

@Entity()
export class JIG {
  @PrimaryGeneratedColumn('increment')
  jigId: number;
  @Column({ nullable: true })
  assetNo: string;
  @Column({ nullable: true })
  category: string;
  @Column({ nullable: true })
  model: string;
  @Column({ nullable: true })
  productName: string;
  @Column({ nullable: true })
  version: number;
  @Column({ nullable: true })
  edition: number;
  @Column({ nullable: true })
  SFC: string;
  @Column({ nullable: true })
  code: string;
  @Column({ nullable: true })
  company: string;
  @Column({ nullable: true })
  weight: string;
  @Column({ nullable: true })
  size: string;
  @Column({ nullable: true })
  maker: string;
  @Column({ nullable: true })
  type: string;
  @Column({ nullable: true })
  material: string;

  @Column({ nullable: true })
  createAt: Date;
  @Column({ nullable: true })
  createBy: string;

  @Column({ nullable: true })
  updateAt: Date;
  @Column({ nullable: true })
  updateBy: string;

  @OneToMany(() => InOutJIG, (ref) => ref.jig)
  inOutJig: InOutJIG[];
}
