import { Injectable } from '@nestjs/common';
import { SynapsProvider } from './synaps.provider';
import { IKycProviderService } from './kyc.provider.interface';

@Injectable()
export class KycFactoryProvider {
  constructor(private readonly synapsProvider: SynapsProvider) {}

  getProviderService(provider: string): IKycProviderService {
    switch (provider.toLowerCase()) {
      case 'synaps':
        return this.synapsProvider;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}
