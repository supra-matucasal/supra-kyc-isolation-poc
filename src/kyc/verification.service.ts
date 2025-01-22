import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { KycVerification } from '../models/kyc-verification.model';
import { SynapsVerification } from '../models/synaps-verification.model';
import { UsersService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(KycVerification)
    private kycVerificationModel: typeof KycVerification,
    private usersService: UsersService,
    private httpService: HttpService,
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

    // Send message to the consumer app (is a webhook)
    if (verification.callbackUrl) {
      // await this.httpService.axiosRef.post(verification.callbackUrl, {
      //   verificationId,
      //   status,
      //   userId: verification.userId,
      //   timestamp: new Date().toISOString(),
      // });
      console.log('Sending webhook to', verification.callbackUrl);
      const response = await firstValueFrom(
        this.httpService.post(verification.callbackUrl, {
          verificationId,
          status,
          supraKycUserId: verification.userId,
          timestamp: new Date().toISOString(),
        }),
      );

      console.log('Response from webhook', response);
    }

    return verification;
  }
}
