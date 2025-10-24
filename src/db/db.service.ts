import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    onModuleInit(): void {
        this.pool = createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
    }
    onModuleDestroy() {
        this.pool.end();
    }

    getPool(): Pool {
        return this.pool;
    }
    
}