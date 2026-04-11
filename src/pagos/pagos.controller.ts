import { Controller, Post, Body, Get } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('procesar')
  procesar(
    @Body('reservaId') reservaId: number,
    @Body('monto') monto: number,
    @Body('metodoPago') metodoPago: string
  ) {
    return this.pagosService.procesarPago(reservaId, monto, metodoPago);
  }

  @Get('totales')
  obtenerTotales() {
    return this.pagosService.obtenerTotales();
  }
}