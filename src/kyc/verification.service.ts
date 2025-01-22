import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { KycVerification } from '../models/kyc-verification.model';
import { SynapsVerification } from '../models/synaps-verification.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(KycVerification)
    private kycVerificationModel: typeof KycVerification,
    private usersService: UsersService,
  ) {}

  async getVerificationBySynapsSessionId(sessionId: string) {
    return this.kycVerificationModel.findOne({
      where: {
        provider: 'synaps',
      },
      include: [
        {
          model: SynapsVerification,
          where: {
            sessionId: sessionId,
          },
        },
      ],
    });
  }

  async updateVerificationStatus(verificationId: number, status: string) {
    const verification =
      await this.kycVerificationModel.findByPk(verificationId);

    if (!verification) {
      throw new Error('Verification not found');
    }

    // Update verification status
    await verification.update({ status });

    // Update user KYC status
    await this.usersService.updateKycStatus(verification.userId, status);

    return verification;
  }
}
