import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Escenario } from './entities/escenario.entity';
import { CreateEscenarioDto } from './dto/create-escenario.dto';

@Injectable()
export class EscenariosService {
  constructor(
    @InjectRepository(Escenario)
    private escenarioRepository: Repository<Escenario>,
  ) {}

  // Convierte "9:00" o "9:00:00" a "09:00:00" para MySQL
  private formatearHora(hora: string): string {
    const partes = hora.split(':');
    const hh = partes[0].padStart(2, '0');
    const mm = partes[1] ? partes[1].padStart(2, '0') : '00';
    return `${hh}:${mm}:00`;
  }

  // Crear un nuevo escenario deportivo
  async create(data: CreateEscenarioDto) {
    const nuevoEscenario = this.escenarioRepository.create({
      ...data,
      horaApertura: this.formatearHora(data.horaApertura),
      horaCierre: this.formatearHora(data.horaCierre),
    });
    return await this.escenarioRepository.save(nuevoEscenario);
  }

  // Obtener todos los escenarios
  async findAll() {
    return await this.escenarioRepository.find();
  }

  // Obtener un escenario por ID
  async findOne(id: number) {
    const escenario = await this.escenarioRepository.findOne({ where: { id } });
    if (!escenario) throw new NotFoundException(`Escenario con ID ${id} no encontrado`);
    return escenario;
  }
}
