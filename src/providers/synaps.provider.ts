import { Injectable } from '@nestjs/common';
import { IKycProviderService } from './kyc.provider.interface';

@Injectable()
export class SynapsProvider implements IKycProviderService {
  async initiateToken(userId: number): Promise<string> {
    console.log('initiateToken with synaps', userId);
    return `synaps-session-${Date.now()}`;
  }

  async handleWebhook(payload: any): Promise<void> {
    console.log('handleWebhook with synaps', payload);
  }
}
