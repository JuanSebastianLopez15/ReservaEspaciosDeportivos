import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  // POST /reservas - Crear una nueva reserva (requiere token JWT)
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createReservaDto: CreateReservaDto) {
    return await this.reservasService.create(createReservaDto);
  }

  // GET /reservas - Listar todas las reservas (requiere token JWT)
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.reservasService.findAll();
  }

  // GET /reservas/totales - Ver totales por escenario (requiere token JWT)
  @Get('totales')
  @UseGuards(JwtAuthGuard)
  getTotales() {
    return this.reservasService.getTotalesPorEscenario();
  }

  // GET /reservas/:id - Ver una reserva por ID (requiere token JWT)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.findOne(id);
  }

  // DELETE /reservas/:id - Eliminar una reserva (requiere token JWT)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.remove(id);
  }
}
