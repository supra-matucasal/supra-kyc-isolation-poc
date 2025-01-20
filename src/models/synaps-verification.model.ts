import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DataType, // Add this import
} from 'sequelize-typescript';
import { KycVerification } from './kyc-verification.model';

@Table({ tableName: 'synaps_verifications' })
export class SynapsVerification extends Model<SynapsVerification> {
  @PrimaryKey
  @ForeignKey(() => KycVerification)
  @Column
  verificationId: number;

  @Column
  sessionId: string;

  @Column({
    type: DataType.JSON,
  })
  metadata: JSON;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
