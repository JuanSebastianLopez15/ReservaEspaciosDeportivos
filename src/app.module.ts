import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { Usuario } from './usuarios/entities/usuario.entity';
import { EscenariosModule } from './escenarios/escenarios.module';
import { ReservasModule } from './reservas/reservas.module';
import { Escenario } from './escenarios/entities/escenario.entity';
import { Reserva } from './reservas/entities/reserva.entity';
import { PagosModule } from './pagos/pagos.module';
import { TwilioModule } from './twilio/twilio.module';
import { Pago } from './pagos/entities/pago.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'reservas_deportivas',
            entities: [Usuario, Escenario, Reserva, Pago],//tablas de mi proyecto
            autoLoadEntities: true,
            synchronize: true,   
        }),
        UsuariosModule,
        AuthModule,
        CommonModule,
        EscenariosModule,
        ReservasModule,
        PagosModule,
        TwilioModule,

    ],
})
export class AppModule {}