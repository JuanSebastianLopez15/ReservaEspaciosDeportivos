import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ReservasService } from './reservas.service';

@Controller('reservas') // Esta línea es la que define la URL http://localhost:3000/reservas
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  async create(
    @Body('usuarioId') usuarioId: number,
    @Body('escenarioId') escenarioId: number,
    @Body('fecha') fecha: string,
    @Body('horaInicio') horaInicio: string,
    @Body('horaFin') horaFin: string,
  ) {
    // Aquí mapeamos los datos del Body directamente al servicio
    return await this.reservasService.create({
      usuarioId,
      escenarioId,
      fecha,
      horaInicio,
      horaFin,
    });
  }

  @Get()
  findAll() {
    return this.reservasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.remove(id);
  }
}