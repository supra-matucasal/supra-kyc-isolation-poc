import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { KycService } from './kyc.service';
import { InitiateKycDto } from './dtos/initiate-kyc.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('supra-kyc')
@ApiTags('Supra KYC')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post(':provider/init')
  @ApiOperation({ summary: 'Generate KYC session for specified provider' })
  @ApiParam({
    name: 'provider',
    required: true,
    description: 'KYC provider (synaps or onfido)',
    enum: ['synaps', 'onfido'],
  })
  @ApiResponse({
    status: 201,
    description: 'KYC sessopm generated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid provider or request parameters',
  })
  initiateSession(
    @Param('provider') provider: string,
    @Body() body: InitiateKycDto,
  ) {
    console.log('initiating session: ', {
      provider,
      body,
    });
    return this.kycService.initiateKycSession(provider, body.email);
  }

  @Get('status/:userid')
  @ApiOperation({ summary: 'Get KYC status for a user' })
  @ApiResponse({
    status: 200,
    description: 'KYC status retrieved successfully',
  })
  getStatus(@Param('userid') userId: number) {
    return this.kycService.getStatus(userId);
  }
}
