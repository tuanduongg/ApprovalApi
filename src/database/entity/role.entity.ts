import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permisstion.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  roleId: number;

  @Column({ nullable: true })
  roleName: string;



  @OneToMany(() => User, (ref) => ref.role)
  users: User[];

  @OneToMany(() => Permission, (ref) => ref.role, { cascade: ['insert', 'update'] })
  permisstions: Permission[];
}
