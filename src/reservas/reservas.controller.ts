import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('reservas')
export class ReservasController {
  
  @Post()
  @UseGuards(JwtAuthGuard) 
  async crearReserva(@Request() req) {
    // req.user contiene la info del token (userId, email, rol)
    const userId = req.user.userId;
    // Lógica para crear reserva solo para este usuario
    return { message: `Reserva creada por usuario ${userId}` };
  }
}