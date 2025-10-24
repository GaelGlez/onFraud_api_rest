/* eslint-disable prettier/prettier */

import { Injectable, ConflictException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { User } from "./dto/users.dto";

@Injectable()
export class UsersRepository{
    constructor(private readonly db: DbService) {}

    // =============== CREAR USUARIO ===============
    async createUser(email:string, full_name:string, password:string): Promise<User | null>{
        try {
            const sql= `INSERT INTO users (email, full_name, password_hash, salt) 
            VALUES ('${email}', '${full_name}', '${password}', 'mysalt')`;
            const [result]: any = await this.db.getPool().query(sql, [email, full_name, password]);
            return {
                id: result.insertId,
                email,
                full_name,
                password_hash: 'hashed_password',
                salt: 'mysalt',
                role: false
            };
            } catch (err: any) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('El email ya está registrado');
            }
            throw err;
        }   
    }

    // =============== ENCONTRAR USUARIOS ===============
    async findUserByEmail(email:string): Promise<User | null>{
        const sql= `SELECT * FROM users WHERE email='${email}' LIMIT 1`;
        const [rows] = await this.db.getPool().query(sql);
        const result = rows as User[];
        return result[0] || null;
    }

    async findUserById(id: number): Promise<User | null> {
        const sql = `SELECT * FROM users WHERE id = ${id} LIMIT 1`;
        const [rows] = await this.db.getPool().query(sql);
        const result = rows as User[];
        return result[0] || null;
    }

    async findAllUsers(): Promise<User[]> {
        const sql = `SELECT * FROM users`;
        const [rows] = await this.db.getPool().query(sql);
        const result = rows as User[];
        return result || [];
    }

    // =============== ACTUALIZAR USUARIO ===============
    // Hace queries SQL, no lógica de negocio
    async updateUser(id: number, email?: string, full_name?: string) {
        // Construir dinámicamente SET solo con los campos que llegan
        const fields: string[] = [];
        const values: any[] = [];

        if (email !== undefined) {
            fields.push('email = ?');
            values.push(email);
        }

        if (full_name !== undefined) {
            fields.push('full_name = ?');
            values.push(full_name);
        }

        if (fields.length === 0) return null; // nada que actualizar

        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        await this.db.getPool().query(sql, values);

        // Traer el usuario actualizado
        const [rows] = await this.db.getPool().query('SELECT id, full_name, email FROM users WHERE id = ?', [id]);
        return (rows as User[])[0] || null;
    }

    // =============== ACTUALIZAR USUARIO (Admin) ===============
    async updateUserAdmin(id: number, email?: string, full_name?: string, newPasswordHash?: string) {
        // Construir dinámicamente SET solo con los campos que llegan
        const fields: string[] = [];
        const values: any[] = [];

        if (email !== undefined) {
            fields.push('email = ?');
            values.push(email);
        }

        if (full_name !== undefined) {
            fields.push('full_name = ?');
            values.push(full_name);
        }

        if (newPasswordHash !== undefined) {
            fields.push('password_hash = ?');
            values.push(newPasswordHash);
        }

        if (fields.length === 0) return null; // nada que actualizar

        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        await this.db.getPool().query(sql, values);

        // Traer el usuario actualizado
        const [rows] = await this.db.getPool().query('SELECT id, full_name, email FROM users WHERE id = ?', [id]);
        return (rows as User[])[0] || null;
    }

    // =============== ACTUALIZAR CONTRASEÑA USUARIO ===============
    async updatePasswordUser(id: number, newPasswordHash: string) {
        const sql = `UPDATE users SET password_hash = ? WHERE id = ?`;
        await this.db.getPool().query(sql, [newPasswordHash, id]);
        return true;
    }

    // =============== ELIMINAR USUARIO ===============
    async deleteUser(id: number): Promise<void> {
        const sql = `DELETE FROM users WHERE id = ?`;
        await this.db.getPool().query(sql, [id]);
    }
}