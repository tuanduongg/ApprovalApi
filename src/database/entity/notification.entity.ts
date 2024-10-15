import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('increment')
  notificationId: number;

  @Column({ nullable: true })
  title: string;
  //remark
  @Column({ type: 'ntext', nullable: true })
  content: string;

  @Column({ nullable: true, default: false })
  isShow: boolean;

  //create at
  @Column({ nullable: true })
  createAt: Date;

  @Column({ nullable: true })
  createBy: string;

  @Column({ nullable: true })
  updateAt: Date;

  @Column({ nullable: true })
  updateby: string;

}
