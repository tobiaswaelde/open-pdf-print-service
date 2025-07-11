import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ENV } from '../config/env';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (ENV.API_TOKEN === null || ENV.API_TOKEN === '') {
      return true;
    }

    // check token
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    this.checkToken(token);

    return true;
  }

  private extractToken(request: Request): string | undefined {
    return (request.query.token as string) ?? request.headers.authorization;
  }

  private checkToken(token: string | undefined): void {
    if (!token) {
      throw new UnauthorizedException('Access denied. No token provided.');
    }

    if (token !== ENV.API_TOKEN) {
      throw new UnauthorizedException('Access denied. Invalid token.');
    }
  }
}
