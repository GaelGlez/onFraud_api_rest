/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { UpdateUserAdminDto, UpdateUserDto } from "./dto/users.dto";
import { LoginUserDto, CreateUserDto } from "src/auth/dto/auth.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(private readonly usersRepository: UsersRepository) {}

    private readonly SALT_ROUNDS = 12; // Puedes ajustar entre 10 y 14 según tu servidor

    // =============== CREAR USUARIO ===============
    async createUser(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, this.SALT_ROUNDS);
        return this.usersRepository.createUser(
            createUserDto.email,
            createUserDto.full_name,
            hashedPassword,
        );
    }

    // =============== ENCONTRAR USUARIOS ===============
    async findUserById(id: number) {
        return this.usersRepository.findUserById(id);
    }

    // =============== VALIDAR USUARIO (Login) ===============
    async validateUser(loginDto: LoginUserDto) {
        const user = await this.usersRepository.findUserByEmail(loginDto.email);
        if (!user) return null;

        const isValid = await bcrypt.compare(loginDto.password, user.password_hash);
        return isValid ? user : null;
    }

    // =============== ENCONTRAR TODOS LOS USUARIOS ===============
    async findAllUsers() {
        return this.usersRepository.findAllUsers();
    }

    // =============== ACTUALIZAR USUARIO ===============
    async updateUser(userId: number, updateDto: UpdateUserDto) {
        const { email, full_name } = updateDto;

        if (!email && !full_name) {
            throw new BadRequestException("No hay campos para actualizar");
        }

        return this.usersRepository.updateUser(userId, email, full_name);
    }

    // =============== ACTUALIZAR USUARIO (Admin) ===============
    async updateUserAdmin(userId: number, updateDto: UpdateUserAdminDto) {
        const { email, full_name, password } = updateDto;

        if (!email && !full_name && !password) {
            throw new BadRequestException("No hay campos para actualizar");
        }

        let hashedPassword: string | undefined = undefined;
        if (password) {
            hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
        }

        return this.usersRepository.updateUserAdmin(userId, email, full_name, hashedPassword);
    }

    // =============== ACTUALIZAR CONTRASEÑA ===============
    async updatePassword(
        userId: number,
        updatePasswordDto: { oldPassword: string; newPassword: string },
    ) {
        const user = await this.usersRepository.findUserById(userId);
        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }

        const isOldPasswordValid = await bcrypt.compare(
            updatePasswordDto.oldPassword,
            user.password_hash,
        );

        if (!isOldPasswordValid) {
            throw new UnauthorizedException("La contraseña antigua no coincide");
        }

        const newHashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, this.SALT_ROUNDS);
        return this.usersRepository.updatePasswordUser(userId, newHashedPassword);
    }

    // =============== VALIDAR ADMIN (Login) ===============
    async validateAdmin(loginDto: LoginUserDto) {
        const user = await this.usersRepository.findUserByEmail(loginDto.email);
        if (!user) return null;

        const isValid = await bcrypt.compare(loginDto.password, user.password_hash);
        if (!isValid || !user.role) return null;

        return user;
    }

    // =============== ELIMINAR USUARIO ===============
    async deleteUser(userId: number): Promise<void> {
        await this.usersRepository.deleteUser(userId);
    }
}
