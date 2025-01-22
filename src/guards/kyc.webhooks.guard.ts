// KYC webhook guards for synaps and other providers

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { SYNAPS_WEBHOOK_SECRET_TOKEN } from '../config';

@Injectable()
export class SynapsWebhookGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const secret = request.query.secret;

    if (secret !== SYNAPS_WEBHOOK_SECRET_TOKEN) {
      throw new UnauthorizedException('Invalid SECRET TOKEN');
    }

    return true;
  }
}
