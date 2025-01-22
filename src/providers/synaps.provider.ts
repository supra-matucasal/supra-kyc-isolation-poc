import { Injectable } from '@nestjs/common';
import {
  IKycProviderService,
  SynapsKycSessionResponse,
} from './kyc.provider.interface';
import { InjectModel } from '@nestjs/sequelize';
import { SynapsVerification } from '../models/synaps-verification.model';
import { SYNAPS_STATUSES, KYC_STATUSES } from '../config';
import { VerificationService } from '../kyc/verification.service';

@Injectable()
export class SynapsProvider implements IKycProviderService {
  constructor(
    @InjectModel(SynapsVerification)
    private synapsVerificationModel: typeof SynapsVerification,
    private verificationService: VerificationService,
  ) {}
  async initiateKycSession(
    verificationId: number,
  ): Promise<SynapsKycSessionResponse> {
    //const synapsSessionId = `synaps-session-${Date.now()}`;
    const synapsSessionId = await this.generateSynapsSdkSession();
    console.log('initiating synaps session', synapsSessionId);
    await this.synapsVerificationModel.create({
      verificationId,
      sessionId: synapsSessionId,
      //metadata: {},
    });

    return {
      synapsSessionId,
    };
  }

  async handleWebhook(payload: any): Promise<void> {
    console.log('handleWebhook with synaps', payload);

    try {
      if (!payload?.session_id) {
        throw new Error('Missing required session_id in webhook payload');
      }

      //const user = await getUserPlain({ synapsSessionId: req.body.session_id });
      const verification =
        await this.verificationService.getVerificationBySynapsSessionId(
          payload.session_id,
        );
      if (!verification) {
        throw new Error('Verification not found for provided session_id');
      }

      if (payload.status === SYNAPS_STATUSES.APPROVED) {
        await this.verificationService.updateVerificationStatus(
          verification.id,
          KYC_STATUSES.COMPLETED,
        );
      } else {
        await this.verificationService.updateVerificationStatus(
          verification.id,
          KYC_STATUSES.DECLINED,
        );
      }

      //await updateUser({ id: user.id }, { kycStatus: KYC_STATUSES.COMPLETED });
    } catch (error) {
      throw error;
    }
  }

  async getExistingKycSession(
    kycVerificationId: number,
  ): Promise<SynapsKycSessionResponse> {
    const verification = await this.synapsVerificationModel.findOne({
      where: { id: kycVerificationId },
    });
    return {
      synapsSessionId: verification?.sessionId,
    };
  }

  async generateSynapsSdkSession() {
    // const sessionStatus = await this.checkSynapsSessionStatus(synapsSessionId);
    // console.log('Synaps Session status: ', sessionStatus);

    // Create new session if no existing session or rejected status
    try {
      const myHeaders = new Headers();
      myHeaders.append('Api-Key', process.env.SYNAPS_API_TOKEN);

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };

      const sessionResponse = await fetch(
        'https://api.synaps.io/v4/session/init',
        {
          ...requestOptions,
          redirect: 'follow' as RequestRedirect,
        },
      );
      const data = await sessionResponse.json();

      // Update user with new session ID
      // await updateUser(
      //   { id: user.id },
      //   {
      //     synapsSessionId: data.session_id,
      //   },
      // );

      return data.session_id;
    } catch (error) {
      throw error;
    }
  }

  async checkSynapsSessionStatus(sessionId: string) {
    try {
      console.log('Checking Synaps session status for sessionId: ', sessionId);
      const myHeaders = new Headers();
      myHeaders.append('Api-Key', process.env.SYNAPS_API_TOKEN);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        `https://api.synaps.io/v4/individual/session/${sessionId}`,
        {
          ...requestOptions,
          redirect: 'follow' as RequestRedirect,
        },
      );
      const data = await response.json();
      console.log('Synaps session status data: ', data);
      return data?.session?.status;
    } catch (error) {
      console.log('Error checking Synaps session status:', error);
      return null;
    }
  }
}
