import { IsInt, IsString, IsNotEmpty, IsDateString, Min } from 'class-validator';

export class CreateReservaDto {
  // ID del usuario que hace la reserva. Ej: 1
  @IsInt()
  usuarioId: number;

  // ID del escenario a reservar. Ej: 1
  @IsInt()
  escenarioId: number;

  // Fecha de la reserva. Formato: "2026-04-15"
  @IsDateString()
  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  fecha: string;

  // Hora de inicio de la reserva. Formato: "10:00" o "10:00:00"
  @IsString()
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  horaInicio: string;

  // Hora de fin de la reserva. Formato: "11:00" o "11:00:00"
  @IsString()
  @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
  horaFin: string;

  // Cantidad de personas que van a usar el escenario
  @IsInt()
  @Min(1, { message: 'Debe haber al menos 1 persona' })
  cantidadPersonas: number;
}

