/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";


export type User = {
    id: number;
    email: string;
    full_name: string;
    password_hash: string;
    salt: string;
};

@Injectable()
export class UsersRepository{
    constructor(private readonly db: DbService) {}

    async createUser(email:string, full_name:string, password:string): Promise<User | null>{
        const sql= `INSERT INTO users (email, full_name, password_hash, salt) 
        VALUES ('${email}', '${full_name}', '${password}', 'mysalt')`;
        await this.db.getPool().query(sql);
        return {
            id: 1,
            email,
            full_name,
            password_hash: 'hashed_password',
            salt: 'mysalt',
        };
    }

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

    /*async updateUser(email:string, name:string){
        const sql = 'UPDATE users SET email=?, name=? WHERE id=?';
        const [rows] = await this.db.getPool().query(sql);
        const result = rows as User[];
        return result[0] || null;
    }*/
}