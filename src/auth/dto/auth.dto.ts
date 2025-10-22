import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, Matches } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        example: "gael@example.com",
        required: true,
        description: "Correo electrónico del usuario. Debe ser único y válido."
    })
    @IsEmail({}, { message: "Debe ser un email válido" })
    email: string;

    @ApiProperty({
        example: "Gael Pérez",
        required: true,
        description: "Nombre completo del usuario (solo letras y espacios)."
    })
    @IsString({ message: "Debe ser un string" })
    @MinLength(3, { message: "El nombre completo debe tener al menos 3 caracteres" })
    @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "El nombre completo solo puede contener letras y espacios" })
    full_name: string;

    @ApiProperty({
        example: "MiClaveSegura123",
        required: true,
        minLength: 9,
        description: "Contraseña del usuario (mínimo 9 caracteres)"
    })
    @IsString({ message: "Debe ser un string" })
    @MinLength(9, { message: "La contraseña debe tener al menos 9 caracteres" })
    password: string;

}

export class LoginUserDto {
    @ApiProperty({
        example: "gael@example.com",
        required: true,
        description: "Correo electrónico del usuario. Debe ser único y válido."
    })
    @IsEmail({}, { message: "Debe ser un email válido" })
    email: string;

    @ApiProperty({
        example: "MiClaveSegura123",
        required: true,
        minLength: 9,
        description: "Contraseña del usuario (mínimo 9 caracteres)"
    })
    @IsString({ message: "Debe ser un string" })
    password: string;
}

export class RefreshUserDto {
    @ApiProperty({ example: "refresh_token", required: true, description: "Token de actualización JWT" })
    @IsString({ message: "Debe ser un string" })
    token: string;
}

export class UserProfile {
    @ApiProperty({ example: 1, description: "ID del usuario" })
    id: number;

    @ApiProperty({ example: "gaelglez@example.com", description: "Correo electrónico del usuario" })
    email: string;

    @ApiProperty({ example: "Gael Glez", description: "Nombre completo del usuario" })
    full_name: string;
}

export type AccessPayload = {
    sub:string; //user id
    type:"access",
    profile:UserProfile
}

export type RefreshPayload = {
    sub:string; //user id
    type:"refresh",
}
