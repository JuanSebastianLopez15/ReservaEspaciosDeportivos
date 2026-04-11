import { Controller, Get, Post, Body } from '@nestjs/common';
import { EscenariosService } from './escenarios.service';

@Controller('escenarios')
export class EscenariosController {
  constructor(private readonly escenariosService: EscenariosService) {}

  @Post()
  create(@Body() data: any) { //el body es como el request de laravel
    return this.escenariosService.create(data);
  }

  @Get()
  findAll() {
    return this.escenariosService.findAll();
  }
}