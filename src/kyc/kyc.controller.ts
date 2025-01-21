import { Body, Controller, Post } from '@nestjs/common';
import { KycService } from './kyc.service';
import { InitiateKycDto } from './dtos/initiate-kyc.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('supra-kyc')
@ApiTags('Supra KYC')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate KYC for a user' })
  @ApiResponse({
    status: 200,
    description: 'KYC token created successfully',
  })
  initiateToken(@Body() body: InitiateKycDto) {
    return this.kycService.initiateToken(body.provider, body.userId);
  }
}
