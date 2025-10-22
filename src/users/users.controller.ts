/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { UpdateUserDto, UpdatePasswordDto, User } from './dto/users.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}

    // Obtener perfil del usuario autenticado
    @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiResponse({ status: 200, description: 'Perfil obtenido correctamente.', type: User })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    async getProfile(@Req() req) {
        const userId = Number(req.user.userId);
        const user = await this.userService.findUserById(userId);
        return { profile: user };
    }

    // Actualizar información del usuario
    @ApiOperation({ summary: 'Actualizar datos del usuario' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put()
    @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente.' , type: UpdateUserDto })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    async updateUser(@Body() updateDto: UpdateUserDto, @Req() req) {
        const userId = Number(req.user.userId);
        return this.userService.updateUser(userId, updateDto);
    }

    // Actualizar contraseña
    @ApiOperation({ summary: 'Actualizar contraseña del usuario' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('password')
    @ApiResponse({ status: 200, description: 'Contraseña actualizada correctamente.' })
    @ApiResponse({ status: 400, description: 'Contraseña actual o nueva inválida.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Req() req) {
        const userId = Number(req.user.userId);
        return this.userService.updatePassword(userId, updatePasswordDto);
    }
}
