import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

class LoginDto {
    correo!: string;
    contrasena!: string;
}

class VerificarCodigoDto {
    usuarioId!: number;
    codigo!: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.loginPaso1(loginDto.correo, loginDto.contrasena);
    }

    @Post('verificar-codigo')
    @HttpCode(HttpStatus.OK)
    async verificarCodigo(@Body() body: VerificarCodigoDto) {
        return this.authService.verificarCodigo(body.usuarioId, body.codigo);
        
    }
    
    
}