import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { UserPayload } from './UserPayload';

@Injectable()
export class AuthGuard implements CanActivate {
  roles: string[] | undefined;

  constructor(roles?: string[]) {
    this.roles = roles;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { req } = context.switchToHttp().getNext();
    const request: Request = req || context.switchToHttp().getRequest();
    const token =
      (request.headers?.authorization || ' ').split(' ')[1] ||
      request.cookies?.token;

    // console.log(token);

    if (!token) {
      throw new UnauthorizedException('token tidak valid');
    }

    try {
      const decoded = verify(
        token,
        process.env.JWT_SECRET_KEY || '',
      ) as UserPayload;

      console.log(decoded);

      if (this.roles && !this.roles.includes(decoded.role)) {
        throw new UnauthorizedException('token salah');
      }

      console.log(decoded.role);

      request['user'] = decoded;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('invalid');
    }
  }
}
