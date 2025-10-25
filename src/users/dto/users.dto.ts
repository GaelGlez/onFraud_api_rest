import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        example: 'gael@example.com',
        required: false,
        description: 'Correo electrónico del usuario (opcional)',
    })
    @IsOptional()
    @IsEmail({}, { message: 'Debe ser un email válido' })
    @MaxLength(255, { message: 'El email no puede exceder los 255 caracteres.' })
    email?: string;

    @ApiProperty({
        example: 'Gael González',
        required: false,
        description: 'Nombre completo del usuario (opcional)',
    })
    @IsOptional()
    @IsString({ message: 'Debe ser un string' })
    @MinLength(5, { message: 'El nombre completo debe tener al menos 5 caracteres.' })
    @MaxLength(100, { message: 'El nombre completo no puede exceder los 100 caracteres.' })
    @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "El nombre completo solo puede contener letras y espacios" })
    full_name?: string;
}

export class UpdateUserAdminDto {
    @ApiProperty({
        example: 'gael@example.com',
        required: false,
        description: 'Correo electrónico del usuario (opcional)',
    })
    @IsOptional()
    @MaxLength(255, { message: 'El email no puede exceder los 255 caracteres.' })
    @IsEmail({}, { message: 'Debe ser un email válido' })
    email?: string;

    @ApiProperty({
        example: 'Gael González',
        required: false,
        description: 'Nombre completo del usuario (opcional)',
    })
    @IsOptional()
    @IsString({ message: 'Debe ser un string' })
    @MinLength(5, { message: 'El nombre completo debe tener al menos 5 caracteres.' })
    @MaxLength(100, { message: 'El nombre completo no puede exceder los 100 caracteres.' })
    @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "El nombre completo solo puede contener letras y espacios" })
    full_name?: string;

    @ApiProperty({
        example: 'password1',
        required: false,
        description: 'Contraseña del usuario (opcional)',
    })
    @IsOptional()
    @IsString({ message: 'Debe ser un string' })
    @MinLength(9, { message: 'La contraseña debe tener al menos 9 caracteres' })
    @MaxLength(64, { message: 'La contraseña no puede exceder los 64 caracteres.' })
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: "La contraseña debe contener al menos una mayúscula y un número" })
    password?: string;
}


export class UpdatePasswordDto {
    @ApiProperty({
        example: 'OldPassword123',
        required: true,
        description: 'Contraseña actual del usuario',
    })
    @IsString({ message: 'Debe ser un string' })
    @MinLength(9, { message: 'La contraseña debe tener al menos 9 caracteres' })
    @MaxLength(64, { message: 'La contraseña no puede exceder los 64 caracteres.' })
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: "La contraseña debe contener al menos una mayúscula y un número" })
    oldPassword: string;

    @ApiProperty({
        example: 'NewPassword123',
        required: true,
        description: 'Nueva contraseña que reemplazará a la anterior',
    })
    @IsString({ message: 'Debe ser un string' })
    @MinLength(9, { message: 'La contraseña debe tener al menos 9 caracteres' })
    @MaxLength(64, { message: 'La contraseña no puede exceder los 64 caracteres.' })
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: "La contraseña debe contener al menos una mayúscula y un número" })
    newPassword: string;
}


export class User {
    @ApiProperty({
        example: 1,
        description: 'Identificador único del usuario',
    })
    id: number;

    @ApiProperty({
        example: 'gael@example.com',
        description: 'Correo electrónico del usuario',
    })
    @IsEmail({}, { message: 'Debe ser un email válido' })
    email: string;

    @ApiProperty({
        example: 'Gael González',
        description: 'Nombre completo del usuario',
    })
    @IsString({ message: 'Debe ser un string' })
    full_name: string;

    @ApiProperty({
        example: '$2b$10$abcdefghijklmnopqrstuv',
        description: 'Hash de la contraseña del usuario (encriptado con bcrypt)',
        writeOnly: true
    })
    password_hash: string;

    @ApiProperty({
        example: '$2b$10$abcdefghijklmnopqrstuv',
        description: 'Salt utilizado para generar el hash de la contraseña',
        writeOnly: true
    })
    salt: string;

    @ApiProperty({
        example: 0,
        description: 'Rol del usuario (0 = usuario normal, 1 = administrador)',
    })
    role: boolean;
}
