import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('escenarios')
export class Escenario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nombre: string;

    @Column()
    deporte: string;

    @Column({ type: 'int' })
    capacidadMaxima: number;

    @Column({ type: 'time' })
    horaApertura: string;

    @Column({ type: 'time' })
    horaCierre: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precioPorHora: number;
}