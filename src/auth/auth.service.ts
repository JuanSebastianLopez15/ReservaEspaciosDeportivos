import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { MailService } from '../common/mail.service';

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
}