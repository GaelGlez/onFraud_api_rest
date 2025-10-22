/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { sha256 } from "src/util/hash/hash.util";
import { UpdateUserDto } from "./dto/users.dto";
import { LoginUserDto, CreateUserDto } from "src/auth/dto/auth.dto";


@Injectable()
export class UserService {
    constructor(private readonly usersRepository: UsersRepository) {}s

    async createUser(createUserDto: CreateUserDto) {
        const hashed_password= sha256(createUserDto.password);
        return this.usersRepository.createUser(createUserDto.email, createUserDto.full_name, hashed_password);
    }

    async findUserById(id: number) {
        return this.usersRepository.findUserById(id);
    }

    async validateUser(loginDto: LoginUserDto) {
        const user = await this.usersRepository.findUserByEmail(loginDto.email);
        if (!user) {
            return null;
        }
        const isValid = user.password_hash === sha256(loginDto.password);
        return isValid ? user : null;
    }

    async findAllUsers() {
        return this.usersRepository.findAllUsers();
    }

    async updateUser(userId: number, updateDto: UpdateUserDto) {
        const { email, full_name } = updateDto;

        if (!email && !full_name) {
            throw new Error("No hay campos para actualizar");
        }
        return this.usersRepository.updateUser(userId, email, full_name);
    }

    async updatePassword(userId: number, updatePasswordDto: { oldPassword: string; newPassword: string; }) {
        const user = await this.usersRepository.findUserById(userId);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        const oldPasswordHash = sha256(updatePasswordDto.oldPassword);
        if (user.password_hash !== oldPasswordHash) {
            throw new Error("La contraseña antigua no coincide");
        }
        user.password_hash = sha256(updatePasswordDto.newPassword);
        return this.usersRepository.updatePasswordUser(userId, user.password_hash);
    }

    async validateAdmin(loginDto: LoginUserDto) {
        const user = await this.usersRepository.findUserByEmail(loginDto.email);
        if (!user) return null;

        const isValid = user.password_hash === sha256(loginDto.password);
        if (!isValid) return null;

        if (!user.role) return null;

        return user;
    }

    async deleteUser(userId: number): Promise<void> {
        await this.usersRepository.deleteUser(userId);
    }

}