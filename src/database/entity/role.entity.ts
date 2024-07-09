import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  roleId: number;

  @Column({ nullable: true })
  roleName: string;

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

  @OneToMany(() => User, (ref) => ref.role)
  users: User[];
}
