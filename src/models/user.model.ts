// user.model.ts
import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  kycStatus: string;
}
