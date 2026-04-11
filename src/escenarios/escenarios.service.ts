import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';//facilita la interaccion con la BD
import { Repository } from 'typeorm';
import { Escenario } from './entities/escenario.entity';

@Injectable()
export class EscenariosService {
  constructor(
    @InjectRepository(Escenario)
    private escenarioRepository: Repository<Escenario>,
  ) {}

  async create(data: any) {
    const nuevoEscenario = this.escenarioRepository.create(data);
    return await this.escenarioRepository.save(nuevoEscenario);
  }

  async findAll() {
    return await this.escenarioRepository.find();
  }
}