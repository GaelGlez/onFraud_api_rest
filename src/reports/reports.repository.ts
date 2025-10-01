/* eslint-disable prettier/prettier */
import { Injectable, ConflictException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateReportDto, UpdateReportDto, Report } from './dto/reports.dto';

@Injectable()
export class ReportsRepository {
  constructor(private readonly db: DbService) {}

  // Crear un reporte
  async createReport(dto: CreateReportDto, userId: number): Promise<Report> {
    const sql = `
      INSERT INTO reports (user_id, category_id, status_id, title, url, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      userId,
      dto.category_id,
      dto.status_id ?? 1,
      dto.title,
      dto.url ?? null,
      dto.description ?? null,
    ];

    try {
      const [result]: any = await this.db.getPool().query(sql, params);
      const insertedId = result.insertId;

      const [rows] = await this.db.getPool().query(
        'SELECT * FROM reports WHERE id = ? LIMIT 1',
        [insertedId],
      );
      return (rows as Report[])[0];
    } catch (err: any) {
      if (err?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Reporte duplicado (conflicto de clave única)');
      }
      throw err;
    }
  }

  // Buscar un reporte por id
  async findById(id: number): Promise<Report | null> {
    const [rows] = await this.db
      .getPool()
      .query('SELECT * FROM reports WHERE id = ? LIMIT 1', [id]);
    return (rows as Report[])[0] ?? null;
  }

  // Listar todos los reportes
  async findAll(): Promise<Report[]> {
    const [rows] = await this.db.getPool().query('SELECT * FROM reports ORDER BY id DESC');
    return rows as Report[];
  }

  // Actualizar dinámicamente un reporte
  async updateReport(id: number, dto: UpdateReportDto): Promise<Report | null> {
    const set: string[] = [];
    const values: any[] = [];

    if (dto.title !== undefined) {
      set.push('title = ?');
      values.push(dto.title);
    }
    if (dto.description !== undefined) {
      set.push('description = ?');
      values.push(dto.description);
    }
    if (dto.url !== undefined) {
      set.push('url = ?');
      values.push(dto.url);
    }
    if (dto.category_id !== undefined) {
      set.push('category_id = ?');
      values.push(dto.category_id);
    }
    if (dto.status_id !== undefined) {
      set.push('status_id = ?');
      values.push(dto.status_id);
    }

    if (set.length === 0) {
      return await this.findById(id);
    }

    const sql = `UPDATE reports SET ${set.join(', ')}, updated_at = NOW() WHERE id = ?`;
    values.push(id);

    await this.db.getPool().query(sql, values);

    const [rows] = await this.db.getPool().query(
      'SELECT * FROM reports WHERE id = ? LIMIT 1',
      [id],
    );
    return (rows as Report[])[0] ?? null;
  }
}
