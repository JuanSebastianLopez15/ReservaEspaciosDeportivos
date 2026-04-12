import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { EscenariosService } from './escenarios.service';
import { CreateEscenarioDto } from './dto/create-escenario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('escenarios')
export class EscenariosController {
  constructor(private readonly escenariosService: EscenariosService) {}

  // POST /escenarios - Solo admin puede crear escenarios
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createEscenarioDto: CreateEscenarioDto) {
    return this.escenariosService.create(createEscenarioDto);
  }

  // GET /escenarios - Cualquier usuario logueado puede ver los escenarios
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.escenariosService.findAll();
  }

  // GET /escenarios/:id - Ver un escenario por ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.escenariosService.findOne(id);
  }
}
