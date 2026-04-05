import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        UsuariosModule,
        PassportModule,
        CommonModule, // para MailService
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'miClaveSecretaSuperSegura2026!',
            signOptions: { expiresIn: '5m' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}