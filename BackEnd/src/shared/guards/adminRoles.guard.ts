// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ADMIN_ROLES_KEY } from '../decorators/adminRoles.decorator';
// import { Role } from '../enums/role.enum';
// import { AdminRole } from '@prisma/client';

// @Injectable()
// export class AdminRolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
//       ADMIN_ROLES_KEY,
//       [context.getHandler(), context.getClass()],
//     );

//     if (!requiredRoles) {
//       return true;
//     }

//     const { user } = context.switchToHttp().getRequest();

//     if (!user) return false;

//     if (user.role !== Role.Admin) return true;

//     return requiredRoles.includes(user.adminRole);
//   }
// }
