import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Reserva } from '../reservas/entities/reserva.entity';
import { TwilioService } from '../twilio/twilio.service';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private pagosRepository: Repository<Pago>,
    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,
    private twilioService: TwilioService,
  ) {}

  async procesarPago(reservaId: number, monto: number, metodoPago: string) {
    // 1. Buscar la reserva
    const reserva = await this.reservasRepository.findOne({
        where: { id: reservaId },
        relations: ['escenario'] // Traemos datos para el mensaje
    });

    if (!reserva) throw new NotFoundException('La reserva no existe');

    // 2. Crear el registro del pago
    const nuevoPago = this.pagosRepository.create({
      monto,
      metodoPago,
      reserva
    });
    await this.pagosRepository.save(nuevoPago);

    // 3. ACTUALIZAR la reserva a "confirmada"
    reserva.estado = 'confirmada' as any;
    await this.reservasRepository.save(reserva);

    // 4. Mandar el mensaje por Twilio
    const mensaje = `¡Hola! Tu reserva para ${reserva.escenario.nombre} el día ${reserva.fecha} ha sido CONFIRMADA. ¡Te esperamos!`;
    await this.twilioService.enviarWhatsApp('whatsapp:+573052406990', mensaje);

    return { message: 'Pago procesado y reserva confirmada', pagoId: nuevoPago.id };
  }

  async obtenerTotales() {
    // 1. Sumamos todo el campo 'monto' de la tabla pagos (usando pagosRepository con 's')
    const resultadoSuma = await this.pagosRepository
      .createQueryBuilder('pago')
      .select('SUM(pago.monto)', 'totalDinero')
      .getRawOne();

    // 2. Contamos cuántos pagos se han hecho (usando pagosRepository con 's')
    const cantidadPagos = await this.pagosRepository.count();

    return {
      mensaje: 'Reporte de totales generado',
      estadisticas: {
        totalDineroRecaudado: Number(resultadoSuma.totalDinero) || 0,
        cantidadReservasPagadas: cantidadPagos
      }
    };
  }
}