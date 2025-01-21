// user.model.ts
import { Table, Column, Model, PrimaryKey, Unique } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Unique
  @Column
  email: string;

  @Column
  kycStatus: string;
}
