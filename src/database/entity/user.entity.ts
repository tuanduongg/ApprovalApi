import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}