import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { AclService } from './acl.service';
import { UserService } from './user.service';

export const RoleGuard = (role: string) => {
  class RoleGuardMixin implements CanActivate {
    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const jwt = request.headers['authorization'];

      if (jwt == null) {
        return false;
      }

      try {
        const userService = new UserService();
        const user = await userService.get('userinfo/admin', jwt);

        if (!user) {
          return false;
        } else {
          const aclService = new AclService();
          const permission = await aclService.get(
            'acl/check-permission/' +
              user.id +
              '/' +
              user.business_id +
              '/' +
              role,
            request.headers['authorization'],
          );
          if (permission.permission == null) return false;
        }

        return true;
      } catch (e) {
        return false;
      }
    }
  }
  const guard = mixin(RoleGuardMixin);
  return guard;
};
