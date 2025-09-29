/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { TokenService } from "./token.service";
import { UserService } from "src/users/users.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiProperty } from "@nestjs/swagger";
import { loginUserDto, refreshUserDto } from "./dto/auth.dto";

@ApiTags('Modulo de Autenticacion') // Agrupa los endpoints de este controlador bajo el tag "Modulo de Autenticacion"
@Controller("auth")
export class AuthController {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
    ){}

    @ApiOperation({summary: 'Login de usuario'}) 
    @Post("login")
    async login(@Body() loginDto: loginUserDto) {
    //async login(@Body() loginDto: {email:string, password:string}) {
        const user = await this.userService.validateUser(loginDto);
        if(user){
            const token= await this.tokenService.generateAccessToken(user);
            const refreshToken= await this.tokenService.generateRefreshToken(user);
            return { access_token: token, refresh_token: refreshToken };
        }
        return { error: "Invalid credentials" };
    }

    @ApiOperation({summary: 'Refresh Token'}) 
    @Post("refresh")
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