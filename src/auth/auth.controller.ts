/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { TokenService } from "./token.service";
import { UserService } from "src/users/users.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginUserDto, RefreshUserDto, CreateUserDto, UserProfile } from "./dto/auth.dto";

@ApiTags('Modulo de Autenticacion')
@Controller("auth")
export class AuthController {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
    ) {}

    // REGISTRO
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado exitosamente',
        schema: {
            example: {
                id: 1,
                email: "gael@example.com",
                full_name: "Gael Pérez",
                created_at: "2025-10-21T18:23:00Z"
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos o email duplicado' })
    @Post("register")
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    // LOGIN USUARIO
    @ApiOperation({ summary: 'Login de usuario' })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({
        status: 200,
        description: 'Inicio de sesión exitoso',
        schema: {
            example: {
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    @Post("login")
    async login(@Body() loginDto: LoginUserDto) {
        const user = await this.userService.validateUser(loginDto);
        if (user) {
            const token = await this.tokenService.generateAccessToken(user);
            const refreshToken = await this.tokenService.generateRefreshToken(user);
            return { access_token: token, refresh_token: refreshToken };
        }
        return { error: "Credenciales inválidas" };
    }

    // LOGIN ADMIN
    @ApiOperation({ summary: 'Login de administrador' })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({
        status: 200,
        description: 'Inicio de sesión de administrador exitoso',
        schema: {
            example: {
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
    })
    @ApiResponse({
        status: 403,
        description: 'Credenciales inválidas o sin permisos de admin'
    })
    @Post("admin/login")
    async adminLogin(@Body() loginDto: LoginUserDto) {
        const admin = await this.userService.validateAdmin(loginDto);
        if (!admin) {
            return { error: "Credenciales inválidas o no tiene permisos de admin" };
        }

        const token = await this.tokenService.generateAccessToken(admin);
        const refreshToken = await this.tokenService.generateRefreshToken(admin);

        return { access_token: token, refresh_token: refreshToken };
    }

    // REFRESH TOKEN
    @ApiOperation({ summary: 'Generar nuevo access token mediante refresh token' })
    @ApiBody({ type: RefreshUserDto })
    @ApiResponse({
        status: 200,
        description: 'Nuevo access token generado exitosamente',
        schema: {
            example: {
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: 'Token de actualización inválido o expirado'
    })
    @Post("refresh-token")
    async refresh(@Body() refreshDto: RefreshUserDto) {
        const payload = await this.tokenService.verifyRefreshToken(refreshDto.token);
        if (payload) {
            const user = await this.userService.findUserById(Number(payload.sub));
            if (user) {
                const newAccessToken = await this.tokenService.generateAccessToken(user);
                return { access_token: newAccessToken };
            }
        }
        return { error: "Invalid refresh token" };
    }

    // FUTUROS ENDPOINTS
    // @Post("forgot-password") ...
    // @Post("reset-password") ...
    // @Post("logout") ...
}
