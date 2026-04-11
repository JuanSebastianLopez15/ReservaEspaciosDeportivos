import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { Reserva } from './entities/reserva.entity';
import { Escenario } from '../escenarios/entities/escenario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Escenario])],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService]
})
export class ReservasModule {}