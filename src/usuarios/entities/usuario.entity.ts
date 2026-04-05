import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum RolUsuario {
    CLIENTE = 'cliente',
    ADMIN = 'admin',
}

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn() 
  id!: number;

    @Column({ length: 100 })
  nombre!: string;

    @Column({ unique: true })
  correo!: string;

    @Column({ type: 'varchar', nullable: false })
  contrasena!: string;

    @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.CLIENTE,
  })
  rol!: RolUsuario;

    @CreateDateColumn()
  fechaRegistro!: Date;
    // NUEVOS CAMPOS
    @Column({ nullable: true, type: 'varchar' })
  codigoVerificacion!: string ; // Código temporal de 2FA

    @Column({ nullable: true, type: 'varchar' })
  codigoCompra!: string ; // Código para compras seguras

    @Column({ default: false })
  primerInicioVerificado!: boolean; 
}