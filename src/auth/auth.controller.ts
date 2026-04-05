import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';


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
    
    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body('refresh_token') refreshToken: string) {
        if (!refreshToken) throw new UnauthorizedException('Refresh token requerido');
        return this.authService.refreshAccessToken(refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req) {
        const userId = req.user.userId;
        return this.authService.logout(userId);
    }
}