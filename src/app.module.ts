import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { Usuario } from './usuarios/entities/usuario.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '123456789',
            database: 'reservasDeportivas_db',
            entities: [Usuario],
            autoLoadEntities: true,
            synchronize: true,   
        }),
        UsuariosModule,
        AuthModule,
        CommonModule,
    ],
})
export class AppModule {}