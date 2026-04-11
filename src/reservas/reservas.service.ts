import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { Escenario } from '../escenarios/entities/escenario.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,
    @InjectRepository(Escenario)
    private escenariosRepository: Repository<Escenario>,
  ) {}

  async create(data: any) {

    const escenario = await this.escenariosRepository.findOneBy({ id: data.escenarioId });
    if (!escenario) throw new NotFoundException('El escenario deportivo no existe');

    // Crear la reserva con estado inicial "pendiente"
    const nuevaReserva = this.reservasRepository.create({
      ...data,
      escenario,
      estado: 'pendiente'
    });

    return await this.reservasRepository.save(nuevaReserva);
  }

  async findAll() {
    return await this.reservasRepository.find({ relations: ['escenario'] });
  }

  async findOne(id: number) {
    const reserva = await this.reservasRepository.findOne({
      where: { id },
      relations: ['escenario', 'usuario'],
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    return reserva;
  }

  async remove(id: number) {
    const reserva = await this.findOne(id);
    return await this.reservasRepository.remove(reserva);
  }
}