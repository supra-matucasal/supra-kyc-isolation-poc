import { Injectable } from '@nestjs/common';
import { KycFactoryProvider } from '../providers/kyc-factory.provider';

@Injectable()
export class KycService {
  constructor(private factory: KycFactoryProvider) {}

  async initiateToken(provider: string, userId: number) {
    const providerService = this.factory.getProviderService(provider);
    return providerService.initiateToken(userId);
  }

  async handleWebhook(provider: string, payload: any) {
    const providerService = this.factory.getProviderService(provider);
    return providerService.handleWebhook(payload);
  }
}
