import { Injectable } from '@nestjs/common';
import { KycFactoryProvider } from '../providers/kyc-factory.provider';
import { UsersService } from '../users/users.service';
import { KycVerification } from '../models/kyc-verification.model';
import { InjectModel } from '@nestjs/sequelize';
import { KYC_STATUSES } from '../config';
import { SynapsVerification } from '../models/synaps-verification.model';

@Injectable()
export class KycService {
  constructor(
    private factory: KycFactoryProvider,
    private usersService: UsersService,
    @InjectModel(KycVerification)
    private kycVerificationModel: typeof KycVerification,
  ) {}

  async initiateKycSession(provider: string, email: string) {
    // Use the user service to find or create the user
    const user = await this.usersService.findOrCreate(email);

    // Check for existing verifications
    const existingVerification = await this.kycVerificationModel.findOne({
      where: {
        userId: user.id,
        provider,
      },
      include: ['synapsData'],
    });

    if (existingVerification) {
      const providerService = this.factory.getProviderService(provider);
      return {
        userId: user.id,
        ...(await providerService.getExistingKycSession(
          existingVerification.id,
        )),
      };
    }

    // Create new verification
    const verification = await this.kycVerificationModel.create({
      userId: user.id,
      provider,
      status: KYC_STATUSES.NOT_SUBMITTED,
    });

    // Get provider service and initiate KYC
    const providerService = this.factory.getProviderService(provider);
    const providerResponse = await providerService.initiateKycSession(
      verification.id,
    );

    return {
      userId: user.id,
      ...providerResponse,
    };
  }

  async handleWebhook(provider: string, payload: any) {
    const providerService = this.factory.getProviderService(provider);
    return providerService.handleWebhook(payload);
  }

  async getStatus(userId: number) {
    const user = await this.usersService.findByUserId(userId);
    return user?.kycStatus;
  }

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

  async getUserBySynapsSessionId(sessionId: string) {
    const verification = await this.kycVerificationModel.findOne({
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

    if (!verification) {
      return null;
    }

    return this.usersService.findByUserId(verification.userId);
  }
}
