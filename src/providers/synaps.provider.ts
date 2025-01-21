import { Injectable } from '@nestjs/common';
import {
  IKycProviderService,
  SynapsKycSessionResponse,
} from './kyc.provider.interface';
import { InjectModel } from '@nestjs/sequelize';
import { SynapsVerification } from '../models/synaps-verification.model';

@Injectable()
export class SynapsProvider implements IKycProviderService {
  constructor(
    @InjectModel(SynapsVerification)
    private synapsVerificationModel: typeof SynapsVerification,
  ) {}
  async initiateKycSession(
    verificationId: number,
  ): Promise<SynapsKycSessionResponse> {
    const synapsSessionId = `synaps-session-${Date.now()}`;
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
  }

  async getExistingKycSession(
    verification: any,
  ): Promise<SynapsKycSessionResponse> {
    return {
      synapsSessionId: verification.synapsData.sessionId,
    };
  }
}
