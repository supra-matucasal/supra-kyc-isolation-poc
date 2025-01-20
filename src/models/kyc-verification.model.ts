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

  // Optionally link to a user table if you have one
  // @ForeignKey(() => User)
  @Column
  userId: number;

  // Which provider is used for this verification? e.g. "synaps" or "onfido"
  @Column
  provider: string; // or an enum-like string

  // High-level status for the KYC process: "pending", "approved", "rejected", etc.
  @Column
  status: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  // Associations with submodels
  @HasOne(() => SynapsVerification)
  synapsData: SynapsVerification;
}
