import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;

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
