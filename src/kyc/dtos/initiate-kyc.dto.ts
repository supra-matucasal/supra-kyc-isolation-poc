import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class InitiateKycDto {
  @ApiProperty({
    description: 'The user ID to initiate KYC for',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The callback URL to send the webhook to',
    example: 'https://example.com/kyc/callback',
  })
  callbackUrl: string;
}
