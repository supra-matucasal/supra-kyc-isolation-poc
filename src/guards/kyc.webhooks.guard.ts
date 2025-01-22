// KYC webhook guards for synaps and other providers

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SYNAPS_WEBHOOK_SECRET_TOKEN } from '../config';
@Injectable()
export class SynapsWebhookGuard extends AuthGuard('synaps') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-synaps-signature'];
    if (signature !== SYNAPS_WEBHOOK_SECRET_TOKEN) {
      throw new UnauthorizedException('Invalid signature');
    }
    return super.canActivate(context);
  }
}
