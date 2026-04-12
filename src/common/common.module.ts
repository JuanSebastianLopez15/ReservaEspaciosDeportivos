import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),       // servidor SMTP de Gmail
          port: configService.get<number>('MAIL_PORT'), // puerto 587
          secure: false,                               // sin SSL directo, usa STARTTLS
          auth: {
            user: configService.get('MAIL_USER'),     // correo remitente
            pass: configService.get('MAIL_PASS'),     // contraseña de aplicación
          },
          tls: {
            rejectUnauthorized: false,                // evita error de certificado SSL
          },
        },
        defaults: {
          from: `"Reservas Deportivas" <${configService.get('MAIL_FROM')}>`, // nombre y correo del remitente
        },
      }),
    }),
  ],
  providers: [MailService],   // registra el servicio de correo
  exports: [MailService],     // lo exporta para que AuthModule pueda usarlo
})
export class CommonModule {}
