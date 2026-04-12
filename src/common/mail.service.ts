import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async enviarCodigoVerificacion(correo: string, codigo: string) {
    await this.mailerService.sendMail({
      to: correo,
      subject: 'Código de verificación',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 30px; border-radius: 10px; background-color: #1a1a2e; color: white;">
          <h2 style="color: #00d4ff;">Código de verificación</h2>
          <p>Hola,</p>
          <p>Tu código de verificación de dos pasos es:</p>
          <div style="font-size: 40px; font-weight: bold; text-align: center; padding: 20px; background-color: #000; border-radius: 8px; letter-spacing: 8px;">
            ${codigo}
          </div>
          <p>Este código expirará en <strong>10 minutos</strong>.</p>
          <p>Si no solicitaste este código, ignora este mensaje.</p>
          <hr style="border-color: #333;">
          <small>Reservas Deportivas - Sistema de autenticación segura</small>
        </div>
      `,
    });
  }
}