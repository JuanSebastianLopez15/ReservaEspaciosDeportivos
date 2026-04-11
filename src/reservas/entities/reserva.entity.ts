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
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;

    // Relación con el Escenario
    @ManyToOne(() => Escenario)
    @JoinColumn({ name: 'escenarioId' })
    escenario: Escenario;

    @Column({ type: 'date' })
    fecha: string;

    @Column({ type: 'time' })
    horaInicio: string;

    @Column({ type: 'time' })
    horaFin: string;

    @Column({ type: 'enum', enum: EstadoReserva, default: EstadoReserva.PENDIENTE })
    estado: EstadoReserva;
}