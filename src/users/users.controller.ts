/* eslint-disable prettier/prettier */

import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./users.service";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example:"gael@example.com", required:true}) // Descripción de la propiedad para Swagger
    email: string;
    @ApiProperty({example:"Gael", required:true})
    name: string;
    @ApiProperty({example:"123456", required:true})
    password: string;
};

@ApiTags('Modulo de Usuarios') // Agrupa los endpoints de este controlador bajo el tag "Modulo de Usuarios"
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Crear un nuevo usuario'}) // Descripción de la operación para Swagger
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(
            createUserDto.email,
            createUserDto.name,
            createUserDto.password,
        );
    }
}