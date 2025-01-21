import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KycModule } from './kyc/kyc.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { KycVerification } from './models/kyc-verification.model';
import { SynapsVerification } from './models/synaps-verification.model';
import { User } from './models/user.model';
import {
  APP_ENV,
  DB_HOSTNAME,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
} from './config';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: DB_HOSTNAME,
      port: Number(DB_PORT ?? 5432),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      models: [User, KycVerification, SynapsVerification],
      autoLoadModels: true,
      logging: false,
      synchronize: APP_ENV === 'development',
    }),
    KycModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
