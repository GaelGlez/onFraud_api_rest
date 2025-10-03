/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Put, Req,UseGuards } from "@nestjs/common";
import { UserService } from "./users.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiProperty } from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/users.dto";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags('Modulo de Usuarios') // Agrupa los endpoints de este controlador bajo el tag "Modulo de Usuarios"
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UserService, 
    ) {}

    //El controller recibe los datos que el usuario quiere cambiar. Pasa 'userId' y 'updateDto' al service
    // Recibe datos y token
    @ApiOperation({ summary: 'Actualizar un usuario' })
    @Put()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async updateUser(@Body() updateDto: UpdateUserDto, @Req() req) {
        const userId = Number(req.user.userId);  // <- aquí
        console.log("REQ USER:", req.user);
        return this.userService.updateUser(userId, updateDto);
    }


    @ApiOperation({summary: 'Obtener perfil del usuario'})
    @Get("profile")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth() // Indica que este endpoint requiere autenticación con Bearer token
    @ApiResponse({ status: 201, description: 'Perfil del usuario obtenido correctamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    getProfile(@Req() req: AuthenticatedRequest) {
            return { profile: req.user.profile };
        }
}