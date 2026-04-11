import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Reserva } from '../../reservas/entities/reserva.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column()
  metodoPago: string; // Ejemplo: 'Transferencia', 'Efectivo'

  @CreateDateColumn()
  fechaPago: Date;

  @ManyToOne(() => Reserva, (reserva) => reserva.id)
  reserva: Reserva;
}
