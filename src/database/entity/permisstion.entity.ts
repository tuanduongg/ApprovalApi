import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  screen: string;


  @Column({ nullable: true })
  read: boolean;

  @Column({ nullable: true })
  create: boolean;

  @Column({ nullable: true })
  update: boolean;

  @Column({ nullable: true })
  delete: boolean;

  @Column({ nullable: true })
  import: boolean;

  @Column({ nullable: true })
  export: boolean;

  @Column({ nullable: true })
  accept: boolean;

  @ManyToOne(() => Role, (ref) => ref.permisstions)
  @JoinColumn({ name: 'roleId', referencedColumnName: 'roleId' })
  role: Role
}
