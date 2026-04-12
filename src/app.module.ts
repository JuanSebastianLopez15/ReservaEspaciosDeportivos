import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
        // 1. Cargar variables de entorno globalmente
        ConfigModule.forRoot({
            isGlobal: true,      // Para que esté disponible en toda la app
            envFilePath: '.env', // Ruta del archivo .env (por defecto es '.env')
        }),

        // 2. Configurar TypeORM de forma asíncrona usando ConfigService
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [Usuario, Escenario, Reserva, Pago],
                autoLoadEntities: true,
                synchronize: true,   // Solo desarrollo. En producción usar migraciones.
            }),
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