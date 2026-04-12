import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { Escenario } from '../escenarios/entities/escenario.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,
    @InjectRepository(Escenario)
    private escenariosRepository: Repository<Escenario>,
  ) {}

  // Convierte "9:00" o "9:00:00" a "09:00:00" para MySQL
  private formatearHora(hora: string): string {
    const partes = hora.split(':');
    const hh = partes[0].padStart(2, '0');
    const mm = partes[1] ? partes[1].padStart(2, '0') : '00';
    return `${hh}:${mm}:00`;
  }

  async create(data: CreateReservaDto) {
    // Formateamos las horas antes de validar
    const horaInicio = this.formatearHora(data.horaInicio);
    const horaFin = this.formatearHora(data.horaFin);

    // 1. Verificar que el escenario existe
    const escenario = await this.escenariosRepository.findOneBy({ id: data.escenarioId });
    if (!escenario) throw new NotFoundException('El escenario deportivo no existe');

    // 2. Validar capacidad de personas
    if (data.cantidadPersonas > escenario.capacidadMaxima) {
      throw new BadRequestException(
        `El escenario tiene capacidad maxima de ${escenario.capacidadMaxima} personas`
      );
    }

    // 3. Validar que la reserva este dentro del horario del escenario
    if (horaInicio < escenario.horaApertura || horaFin > escenario.horaCierre) {
      throw new BadRequestException(
        `El escenario solo esta disponible de ${escenario.horaApertura} a ${escenario.horaCierre}`
      );
    }

    // 4. Validar que horaFin sea mayor que horaInicio
    if (horaFin <= horaInicio) {
      throw new BadRequestException('La hora de fin debe ser mayor a la hora de inicio');
    }

    // 5. Validar duracion minima y maxima segun el deporte
    const [hIni, mIni] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);
    const duracionMinutos = (hFin * 60 + mFin) - (hIni * 60 + mIni);

    if (duracionMinutos < escenario.duracionMinimaMinutos) {
      throw new BadRequestException(
        `La reserva para ${escenario.deporte} debe durar minimo ${escenario.duracionMinimaMinutos} minutos`
      );
    }

    if (duracionMinutos > escenario.duracionMaximaMinutos) {
      throw new BadRequestException(
        `La reserva para ${escenario.deporte} no puede superar ${escenario.duracionMaximaMinutos} minutos`
      );
    }

    // 6. Validar traslape de horarios
    const traslape = await this.reservasRepository
      .createQueryBuilder('reserva')
      .where('reserva.escenarioId = :escenarioId', { escenarioId: data.escenarioId })
      .andWhere('reserva.fecha = :fecha', { fecha: data.fecha })
      .andWhere('reserva.estado != :cancelada', { cancelada: 'cancelada' })
      .andWhere(
        '(reserva.horaInicio < :horaFin AND reserva.horaFin > :horaInicio)',
        { horaInicio, horaFin }
      )
      .getOne();

    if (traslape) {
      throw new BadRequestException(
        `El escenario ya esta reservado de ${traslape.horaInicio} a ${traslape.horaFin} en esa fecha`
      );
    }

    // 7. Todo bien, crear la reserva
    const nuevaReserva = this.reservasRepository.create({
      ...data,
      horaInicio,
      horaFin,
      escenario,
      estado: 'pendiente' as any,
    });

    return await this.reservasRepository.save(nuevaReserva);
  }

  // Obtener todas las reservas con sus relaciones
  async findAll() {
    return await this.reservasRepository.find({ relations: ['escenario', 'usuario'] });
  }

  // Obtener una reserva por ID
  async findOne(id: number) {
    const reserva = await this.reservasRepository.findOne({
      where: { id },
      relations: ['escenario', 'usuario'],
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    return reserva;
  }

  // Totales de reservas por escenario
  async getTotalesPorEscenario() {
    const escenarios = await this.escenariosRepository.find();
    const resultado = await Promise.all(
      escenarios.map(async (escenario) => {
        const reservas = await this.reservasRepository.find({
          where: { escenario: { id: escenario.id } },
          relations: ['escenario'],
        });
        const confirmadas = reservas.filter(r => r.estado === 'confirmada' as any).length;
        const pendientes = reservas.filter(r => r.estado === 'pendiente' as any).length;
        const canceladas = reservas.filter(r => r.estado === 'cancelada' as any).length;

        return {
          escenario: escenario.nombre,
          deporte: escenario.deporte,
          totalReservas: reservas.length,
          confirmadas,
          pendientes,
          canceladas,
        };
      })
    );
    return resultado;
  }

  // Eliminar una reserva
  async remove(id: number) {
    const reserva = await this.findOne(id);
    return await this.reservasRepository.remove(reserva);
  }
}