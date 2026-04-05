import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        // Configuración para Gmail
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mateoq152006@gmail.com',   
                pass: 'ujqu vcvd rnpv mrni',  
            },
        });
    }

    async enviarCodigoVerificacion(email: string, codigo: string) {
        try {
            const info = await this.transporter.sendMail({
                from: '"Seguridad - Reservas Deportivas" <mateoq152006@gmail.com>',
                to: email,
                subject: 'Código de verificación - 2FA',
                text: `Tu código de verificación es: ${codigo}. Válido por 10 minutos.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2c3e50;">🔐 Código de verificación</h2>
                        <p>Hola,</p>
                        <p>Tu código de verificación de dos pasos es:</p>
                        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 32px; letter-spacing: 5px; font-weight: bold;">
                            ${codigo}
                        </div>
                        <p>Este código expirará en <strong>10 minutos</strong>.</p>
                        <p>Si no solicitaste este código, ignora este mensaje.</p>
                        <hr>
                        <small>Reservas Deportivas - Sistema de autenticación segura</small>
                    </div>
                `,
            });
            console.log('✅ Correo enviado a:', email);
            console.log('📨 ID del mensaje:', info.messageId);
            return info;
        } catch (error) {
            console.error('❌ Error al enviar correo:', error);
            throw new Error('No se pudo enviar el código de verificación');
        }
    }

    
}