import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { KycFactoryProvider } from '../providers/kyc-factory.provider';
import { SynapsProvider } from '../providers/synaps.provider';

@Module({
  controllers: [KycController],
  providers: [KycService, SynapsProvider, KycFactoryProvider],
})
export class KycModule {}
