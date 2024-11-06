import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { Concept } from './concept.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  userId: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  userName: string;

  @Column({ nullable: true, default: null  })
  department: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: false })
  isRoot: boolean; //isRoot: có thể vào tất cả

  @Column({ nullable: true, default: false })
  isKorean: boolean; //account hàn quốc

  @ManyToOne(() => Role, (ref) => ref.users)
  @JoinColumn({name : 'roleId', referencedColumnName: 'roleId'})
  role: Role

  @OneToMany(() => Concept, (ref) => ref.user)
  concepts: Concept[];
}
