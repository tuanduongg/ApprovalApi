import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  userId: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: false })
  isRoot: boolean; //isRoot: có thể vào tất cả

  @ManyToOne(() => Role, (ref) => ref.users)
  @JoinColumn({name : 'roleId', referencedColumnName: 'roleId'})
  role: Role
}
