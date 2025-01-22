// kyc-verification.model.ts

import {
  Table,
  Column,
  Model,
  PrimaryKey,
  HasOne,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
// import { User } from '...'; // if you have a separate user model
import { SynapsVerification } from './synaps-verification.model';

@Table({ tableName: 'kyc_verifications' })
export class KycVerification extends Model<KycVerification> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number;

  // @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  provider: string;

  @Column
  status: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column
  callbackUrl: string;

  // Associations with submodels
  @HasOne(() => SynapsVerification)
  synapsData: SynapsVerification;
}
