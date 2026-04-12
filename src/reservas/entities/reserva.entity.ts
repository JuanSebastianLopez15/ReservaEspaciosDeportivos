import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Escenario } from '../../escenarios/entities/escenario.entity';

export enum EstadoReserva {
    PENDIENTE = 'pendiente',
    CONFIRMADA = 'confirmada',
    CANCELADA = 'cancelada',
}

@Entity('reservas')
export class Reserva {
    // ID único de la reserva
    @PrimaryGeneratedColumn()
    id: number;

    // Usuario que hizo la reserva
    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;

    // Escenario reservado
    @ManyToOne(() => Escenario)
    @JoinColumn({ name: 'escenarioId' })
    escenario: Escenario;

    // Fecha de la reserva. Formato: "2026-04-15"
    @Column({ type: 'date' })
    fecha: string;

    // Hora de inicio. Formato: "10:00:00"
    @Column({ type: 'time' })
    horaInicio: string;

    // Hora de fin. Formato: "11:00:00"
    @Column({ type: 'time' })
    horaFin: string;

    // Cantidad de personas que usarán el escenario
    @Column({ type: 'int', default: 1 })
    cantidadPersonas: number;

    // Estado actual de la reserva
    @Column({ type: 'enum', enum: EstadoReserva, default: EstadoReserva.PENDIENTE })
    estado: EstadoReserva;
}
