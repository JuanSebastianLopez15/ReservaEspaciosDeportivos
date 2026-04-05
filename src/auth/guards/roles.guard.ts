import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        // Obtener los roles requeridos del decorador @Roles()
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        
        // Si no hay roles requeridos, permitir acceso
        if (!requiredRoles) {
            return true;
        }

        // Obtener el usuario de la request (agregado por JwtAuthGuard)
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('No tienes permiso para acceder a este recurso');
        }

        // Verificar si el usuario tiene alguno de los roles requeridos
        const hasRole = requiredRoles.includes(user.rol);
        
        if (!hasRole) {
            throw new ForbiddenException('Acceso denegado. Se requieren permisos de administrador.');
        }

        return true;
    }
}