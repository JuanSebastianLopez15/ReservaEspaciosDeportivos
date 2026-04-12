import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('escenarios')
export class Escenario {
    // ID único del escenario
    @PrimaryGeneratedColumn()
    id: number;

    // Nombre del escenario. Ej: "Cancha Sintética Los Campeones"
    @Column({ length: 100 })
    nombre: string;

    // Deporte que se practica. Ej: "Fútbol", "Tenis", "Baloncesto"
    @Column()
    deporte: string;

    // Cantidad maxima de personas permitidas
    @Column({ type: 'int' })
    capacidadMaxima: number;

    // Hora de apertura del escenario. Formato: "08:00:00"
    @Column({ type: 'time' })
    horaApertura: string;

    // Hora de cierre del escenario. Formato: "22:00:00"
    @Column({ type: 'time' })
    horaCierre: string;

    // Precio por hora de alquiler
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precioPorHora: number;

    // Duración minima de reserva en minutos. Ej: fútbol=90, tenis=60
    @Column({ type: 'int', default: 60 })
    duracionMinimaMinutos: number;

    // Duración maxima de reserva en minutos. Ej: fútbol=120, tenis=120
    @Column({ type: 'int', default: 120 })
    duracionMaximaMinutos: number;
}
