/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { TokenService } from "./token.service";
import { UserService } from "src/users/users.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiProperty } from "@nestjs/swagger";
import { loginUserDto, refreshUserDto, CreateUserDto } from "./dto/auth.dto";

@ApiTags('Modulo de Autenticacion') // Agrupa los endpoints de este controlador bajo el tag "Modulo de Autenticacion"
@Controller("auth")
export class AuthController {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
    ){}

    @ApiOperation({summary: 'Crear un nuevo usuario'}) 
    @Post("register")
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }


    @ApiOperation({summary: 'Login de usuario'}) 
    @Post("login")
    async login(@Body() loginDto: loginUserDto) {
        const user = await this.userService.validateUser(loginDto);
        if(user){
            const token= await this.tokenService.generateAccessToken(user);
            const refreshToken= await this.tokenService.generateRefreshToken(user);
            return { access_token: token, refresh_token: refreshToken };
        }
        return { error: "Invalid credentials" };
    }

    // ✅ Login exclusivo para admin
    @ApiOperation({ summary: 'Login de admin' })
    @Post("admin/login")
    async adminLogin(@Body() loginDto: loginUserDto) {
        const admin = await this.userService.validateAdmin(loginDto);
        if (!admin) {
            return { error: "Credenciales inválidas o no tiene permisos de admin" };
        }

        const token = await this.tokenService.generateAccessToken(admin);
        const refreshToken = await this.tokenService.generateRefreshToken(admin);

        return { access_token: token, refresh_token: refreshToken };
    }


    @ApiOperation({summary: 'Refresh Token'}) 
    @Post("refresh-token")
    async refresh(@Body() refreshDto: refreshUserDto) {
    //async refresh(@Body() refreshDto: { token: string }) {
        const payload= await this.tokenService.verifyRefreshToken(refreshDto.token);
        if (payload) {
            const user = await this.userService.findUserById(Number(payload.sub));
            if (user) {
                const newAccessToken = await this.tokenService.generateAccessToken(user);
                return { access_token: newAccessToken };
            }
        }
        return { error: "Invalid refresh token" };
    }

    // Enpointds faltantes
    // POST /auth/forgot-password → Enviar correo con link/código para resetear.
    // POST /auth/reset-password → Cambiar contraseña desde el link/código.
    // POST /auth/logout → Cerrar sesión (invalidar token, opcional).
}