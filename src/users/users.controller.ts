/* eslint-disable prettier/prettier */

import { Body, Controller, Post, Put } from "@nestjs/common";
import { UserService } from "./users.service";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/users.dto";
import { TokenService } from "../auth/token.service";


export class CreateUserDto {
    @ApiProperty({example:"gael@example.com", required:true}) // Descripción de la propiedad para Swagger
    email: string;
    @ApiProperty({example:"Gael", required:true})
    full_name: string;
    @ApiProperty({example:"123456", required:true})
    password: string;
};

@ApiTags('Modulo de Usuarios') // Agrupa los endpoints de este controlador bajo el tag "Modulo de Usuarios"
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UserService, 
        private readonly tokenService: TokenService
    ) {}

    @ApiOperation({summary: 'Crear un nuevo usuario'}) // Descripción de la operación para Swagger
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(
            createUserDto.email,
            createUserDto.full_name,
            createUserDto.password,
        );
    }

    //El controller recibe los datos que el usuario quiere cambiar. Pasa 'userId' y 'updateDto' al service
    // Recbe datos y token
    @Put()
    async updateUser(@Body() updateDto: UpdateUserDto, @Body('token') token:string) {
        const payload = await this.tokenService.verifyRefreshToken(token);
        if (payload) {
            const userId = Number(payload.sub);
            // Aquí llamarías al servicio para actualizar el usuario
            const updateUser = await this.userService.updateUser(userId, updateDto);
            return updateUser;
        }
    }
}