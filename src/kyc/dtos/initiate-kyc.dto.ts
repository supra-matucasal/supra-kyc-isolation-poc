import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsIn } from 'class-validator';

export class InitiateKycDto {
  @ApiProperty({
    description: 'The KYC provider to use (e.g., "synaps", "onfido")',
    example: 'synaps',
  })
  @IsString()
  @IsIn(['synaps', 'onfido'])
  provider: string;

  @ApiProperty({
    description: 'The user ID to initiate KYC for',
    example: 1,
  })
  @IsNumber()
  userId: number;
}
