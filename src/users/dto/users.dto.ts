import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";



export class UpdateUserDto {
    @ApiProperty({example:"gael@example.com", required:false}) // Descripción de la propiedad para Swagger
    @IsOptional()
    @IsEmail({}, { message: "Debe ser un email válido" })
    email?: string; // opcional

    @ApiProperty({example:"Gael", required:false})
    @IsOptional()
    @IsString({ message: "Debe ser un string" })    
    full_name?: string;  // opcional
}

export class CreateUserDto {
    @ApiProperty({example:"gael@example.com", required:true}) // Descripción de la propiedad para Swagger
    @IsEmail({}, { message: "Debe ser un email válido" })
    email: string;

    @ApiProperty({example:"Gael", required:true})
    @IsString({ message: "Debe ser un string" })
    full_name: string;

    @ApiProperty({example:"123456", required:true})
    @IsString({ message: "Debe ser un string" })
    @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    password: string;
};

export class User {
    @ApiProperty({example:1, required:true})
    id: number;
    @ApiProperty({example:"gael@example.com", required:true})
    @IsEmail({}, { message: "Debe ser un email válido" })
    email: string;
    @ApiProperty({example:"Gael", required:true})
    @IsString({ message: "Debe ser un string" })
    full_name: string;
    @ApiProperty({example:"$2b$10$abcdefghijklmnopqrstuv", required:true})
    password_hash: string;
    @ApiProperty({example:"$2b$10$abcdefghijklmnopqrstuv", required:true})
    salt: string;
};