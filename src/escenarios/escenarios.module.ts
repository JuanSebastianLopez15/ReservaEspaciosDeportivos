import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscenariosService } from './escenarios.service';
import { EscenariosController } from './escenarios.controller';
import { Escenario } from './entities/escenario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Escenario])],
  controllers: [EscenariosController],
  providers: [EscenariosService],
})
export class EscenariosModule {}