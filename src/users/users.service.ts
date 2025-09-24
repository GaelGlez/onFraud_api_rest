/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { sha256 } from "src/util/hash/hash.util";
import { UpdateUserDto } from "./dto/users.dto";


@Injectable()
export class UserService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async createUser(email: string, name: string, password: string) {
        console.log("Aqui cifraremos la contraseña");
        const hashed_password= sha256(password);
        return this.usersRepository.createUser(email, name, hashed_password);
    }

    async findUserById(id: number) {
        return this.usersRepository.findUserById(id);
    }

    async validateUser(email:string, password:string){
        const user = await this.usersRepository.findUserByEmail(email);
        if (!user) {
            return null;
        }
        console.log(user);
        console.log("Password : "+ password);
        console.log("Password Hash : "+ user.password_hash);
        console.log("Hashed Password : "+ sha256(password));
        const isValid = user.password_hash === sha256(password);
        return isValid ? user : null;
    }

    async findAllUsers() {
        return this.usersRepository.findAllUsers();
    }

    // Centraliza la lógica de negocio, validaciones, reglas
    async updateUser(userId: number, updateDto: UpdateUserDto) {
        const { email, full_name } = updateDto;

        // Logica que verifica que al menos hay un campo a actualizar
        if (!email && !full_name) {
            throw new Error("No hay campos para actualizar");
        }
        // Aqui se manda a llamar al repositorio para actualizar el usuario
        return this.usersRepository.updateUser(userId, email, full_name);

    }
}