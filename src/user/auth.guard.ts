import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const jwtToken = request.headers['authorization'];

      if (!jwtToken) {
        throw new UnauthorizedException(
          'Authorization header is missing or token is not inserted',
        );
      }

      const payload = await this.jwtService.verifyAsync(jwtToken);

      const user = await this.userService.get('userinfo/admin', jwtToken);

      if (!user || user.id !== payload.id)
        throw new NotAcceptableException(
          'You will need to have the necessary permissions and access levels for this action',
        );

      request['authUser'] = user;
    } catch (e) {
      throw new UnauthorizedException(e.message || 'Unauthorized');
    }
    return true;
  }
}
