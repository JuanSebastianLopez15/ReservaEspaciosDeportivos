import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { MailService } from '../common/mail.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private usuarioservice: UsuariosService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) {}

    async loginPaso1(correo: string, contrasena: string) {
        const usuario = await this.usuarioservice.findByCorreo(correo);
        if (!usuario) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const passwordValida = await this.usuarioservice.validarPassword(contrasena, usuario.contrasena);
        if (!passwordValida) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        if (!usuario.primerInicioVerificado) {
            const codigo = Math.floor(100000 + Math.random() * 900000).toString();
            usuario.codigoVerificacion = codigo;
            await this.usuarioservice.update(usuario.id, { codigoVerificacion: codigo });

            await this.mailService.enviarCodigoVerificacion(usuario.correo, codigo);

            return {
                mensaje: 'Se ha enviado un código de verificación a tu correo',
                requiereCodigo: true,
                usuarioId: usuario.id,
            };
        }

        if (usuario.primerInicioVerificado) {
        const accessToken = await this.jwtService.signAsync({ sub: usuario.id, email: usuario.correo, rol: usuario.rol }, { expiresIn: '5m' });
        const refreshToken = uuidv4(); // o usar JWT con más expiración
        await this.usuarioservice.update(usuario.id, { refreshToken });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
            }
        };
    }

        

        const token = await this.jwtService.signAsync({
            sub: usuario.id,
            email: usuario.correo,
            rol: usuario.rol,
        });

        return {
            access_token: token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
            },
        };
    }

    async verificarCodigo(usuarioId: number, codigo: string) {
        const usuario = await this.usuarioservice.findOne(usuarioId);
        if (!usuario || usuario.codigoVerificacion !== codigo) {
            throw new UnauthorizedException('Código incorrecto o expirado');
        }

        usuario.primerInicioVerificado = true;
        usuario.codigoVerificacion = "";
        await this.usuarioservice.update(usuario.id, {
    primerInicioVerificado: true,
    codigoVerificacion: "",  
    });

        const token = await this.jwtService.signAsync({
            sub: usuario.id,
            email: usuario.correo,
            rol: usuario.rol,
        });

        return {
            access_token: token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
            },
        };
    }


    async refreshAccessToken(refreshToken: string) {
        const usuario = await this.usuarioservice.findByRefreshToken(refreshToken);
        if (!usuario) {
            throw new UnauthorizedException('Refresh token inválido o expirado');
        }
        const newAccessToken = await this.jwtService.signAsync(
            {
                sub: usuario.id,
                email: usuario.correo,
                rol: usuario.rol,
            },
            { expiresIn: '5m' }
        );
        return { access_token: newAccessToken };
    }

    async logout(userId: number) {
        await this.usuarioservice.update(userId, { refreshToken: null });
        return { message: 'Sesión cerrada correctamente' };
    }
}