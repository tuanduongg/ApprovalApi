import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ListAPI {
  @PrimaryGeneratedColumn('increment')
  apiID: number;

  @Column({ nullable: true })
  apiUrl: string;

  @Column({ nullable: true })
  apiScreen: string;

  @Column({ nullable: true })
  apiType: string;

}
