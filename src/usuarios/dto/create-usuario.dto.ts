import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre!: string;

    @IsEmail()
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    correo!: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    contrasena!: string;
}