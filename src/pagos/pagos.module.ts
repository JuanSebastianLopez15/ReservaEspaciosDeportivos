import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago } from './entities/pago.entity';
import { Reserva } from '../reservas/entities/reserva.entity';
import { TwilioModule } from '../twilio/twilio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago, Reserva]),
    ConfigModule,
    TwilioModule,
  ],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule {}