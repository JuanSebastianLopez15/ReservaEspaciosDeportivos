import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio;

  constructor(private configService: ConfigService) {
    this.client = new Twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async enviarWhatsApp(telefono: string, mensaje: string) {
    let numeroLimpio = telefono.trim();
    numeroLimpio = numeroLimpio.replace('whatsapp:', '');
    if (!numeroLimpio.startsWith('+')) {
      numeroLimpio = `+${numeroLimpio}`;
    }
    return await this.client.messages.create({
      body: mensaje,
      from: this.configService.get('TWILIO_PHONE_NUMBER'),
      to: `whatsapp:${numeroLimpio}`,
    });
  }
}