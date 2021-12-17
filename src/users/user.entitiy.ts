import { Report } from 'src/reports/report.entitiy';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ default: true })
  admin: boolean;
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`The record: ${this} inserted.`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`The record: ${this} is updated`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`The record: ${this} is removed.`);
  }
}
