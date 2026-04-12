import { IsString, IsInt, IsNotEmpty, Min, IsPositive, Max } from 'class-validator';

export class CreateEscenarioDto {
  // Nombre del escenario. Ej: "Cancha Sintetica Los Campeones"
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  // Deporte que se practica. Ej: "Futbol", "Tenis", "Baloncesto"
  @IsString()
  @IsNotEmpty({ message: 'El deporte es obligatorio' })
  deporte: string;

  // Cantidad maxima de personas permitidas en el escenario
  @IsInt()
  @Min(1, { message: 'La capacidad minima es 1 persona' })
  capacidadMaxima: number;

  // Hora de apertura del escenario. Formato: "08:00:00" o "8:00"
  @IsString()
  @IsNotEmpty({ message: 'La hora de apertura es obligatoria' })
  horaApertura: string;

  // Hora de cierre del escenario. Formato: "22:00:00" o "22:00"
  @IsString()
  @IsNotEmpty({ message: 'La hora de cierre es obligatoria' })
  horaCierre: string;

  // Precio por hora de alquiler del escenario. Ej: 50000
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precioPorHora: number;

  // Duracion minima de reserva en minutos. Ej: futbol=90, tenis=60
  @IsInt()
  @Min(30, { message: 'La duracion minima es 30 minutos' })
  duracionMinimaMinutos: number;

  // Duracion maxima de reserva en minutos. Ej: futbol=120, tenis=120
  @IsInt()
  @Min(30, { message: 'La duracion maxima debe ser al menos 30 minutos' })
  @Max(480, { message: 'La duracion maxima no puede superar 8 horas' })
  duracionMaximaMinutos: number;
}