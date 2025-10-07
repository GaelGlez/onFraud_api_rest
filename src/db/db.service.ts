import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    onModuleInit(): void {
        this.pool = createPool({
            port: 3306, // No cambiar
            host: process.env.HOST || 'localhost', // Dirección de tu servidor MySQL (si es local, déjalo como está)
            user: process.env.USER || 'root', // El usuario de tu base de datos (en caso de que no sea root, cámbialo)
            password: process.env.PASSWORD || 'Fridayabi2005', // Cambia esto por la contraseña de tu usuario root
            database: process.env.DATABASE || 'onfraud', // Nombre de la base de datos MySQL
        });
    }
    onModuleDestroy() {
        void this.pool.end();
    }

    getPool(): Pool {
        return this.pool;
    }
    
}