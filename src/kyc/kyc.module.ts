import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { KycFactoryProvider } from '../providers/kyc-factory.provider';
import { SynapsProvider } from '../providers/synaps.provider';
import { UsersModule } from '../users/users.module';
import { KycVerification } from '../models/kyc-verification.model';
import { SynapsVerification } from '../models/synaps-verification.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    UsersModule,
    SequelizeModule.forFeature([KycVerification, SynapsVerification]),
  ],
  controllers: [KycController],
  providers: [KycService, SynapsProvider, KycFactoryProvider],
})
export class KycModule {}
