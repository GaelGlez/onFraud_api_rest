/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateReportDto, UpdateReportDto, Report } from './dto/reports.dto';

@Injectable()
export class ReportsRepository {
  constructor(private readonly db: DbService) {}

    // ===== CREAR =====
    async createReport(dto: CreateReportDto, userId: number) {
    const [result]: any = await this.db.getPool().query(
      `INSERT INTO Reports (user_id, category_id, status_id, title, url, description)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId || null,
        dto.category_id,
        1, // status_id = 1 -> pendiente
        dto.title,
        dto.url,
        dto.description,
      ],
    );
    return result.insertId;
  }

  // ===== EVIDENCIAS =====
  async addEvidence(reportId: number, filePath: string, fileType: string) {
    await this.db.getPool().query(
      `INSERT INTO Reports_evidences (reports_id, file_path, file_type)
      VALUES (?, ?, ?)`,
      [reportId, filePath, fileType],
    );
  }

  async findEvidenceById(id: number) {
    const [rows]: any = await this.db
      .getPool()
      .query('SELECT * FROM reports_evidences WHERE id = ? LIMIT 1', [id]);

  if (!rows[0]) return null;
  
  const row = rows[0]

    // Asegura que estos campos son numéricos
    return {
      ...row,
      id: Number(row.id),
      report_id: Number(row.reports_id), // ojo al nombre real en la tabla
    };
  }

  async deleteEvidence(id: number) {
    await this.db.getPool().query('DELETE FROM reports_evidences WHERE id = ?', [id]);
    return { message: 'Evidencia eliminada correctamente' };
  }

  // ===== CONSULTAS DE REPORTES =====
  async findByReportId(id: number): Promise<Report | null> {
    const [rows] = await this.db
      .getPool()
      .query(`
        SELECT r.*,
              u.full_name AS user_name,
              c.name AS category_name,
              s.name AS status_name
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN statuses s ON r.status_id = s.id
        WHERE r.id = ? LIMIT 1
      `, [id]);
    return (rows as Report[])[0] ?? null;
  }

  async findAllReports(filters: {
    categoryId?: number;
    statusId?: number;
    url?: string;
    keyword?: string;
    limit?: number;
    offset?: number;
  }): Promise<Report[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (filters.categoryId) {
      conditions.push('category_id = ?');
      values.push(filters.categoryId);
    }
    if (filters.statusId) {
      conditions.push('status_id = ?');
      values.push(filters.statusId);
    }
    if (filters.url) {
      conditions.push('url = ?');
      values.push(filters.url);
    }
    if (filters.keyword) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      values.push(`%${filters.keyword}%`, `%${filters.keyword}%`);
    }

    let sql = `
      SELECT r.*,
            u.full_name AS user_name,
            c.name AS category_name,
            s.name AS status_name
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN statuses s ON r.status_id = s.id
    `;

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY id DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(filters.limit);
    }
    if (filters.offset) {
      sql += ' OFFSET ?';
      values.push(filters.offset);
    }

    const [rows] = await this.db.getPool().query(sql, values);
    return rows as Report[];
  }

  async findReportsByUser(userId: number): Promise<Report[]> {
    const [rows] = await this.db.getPool().query(`
      SELECT r.*,
            u.full_name AS user_name,
            c.name AS category_name,
            s.name AS status_name
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN statuses s ON r.status_id = s.id
      WHERE r.user_id = ?
    `, [userId]);
    const result = rows as Report[];
    return result;
  }

  async findReportsByUserAndStatus(userId: number, statusId: number): Promise<Report[]> {
    const [rows] = await this.db.getPool().query(`
      SELECT r.*,
            u.full_name AS user_name,
            c.name AS category_name,
            s.name AS status_name
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN statuses s ON r.status_id = s.id
      WHERE r.user_id = ? AND r.status_id = ?
    `, [userId, statusId]);
    return rows as Report[];
  }

  // ===== ACTUALIZAR =====
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
      return await this.findByReportId(id);
    }

    const sql = `UPDATE reports SET ${set.join(', ')}, updated_at = NOW() WHERE id = ?`;
    values.push(id);

    await this.db.getPool().query(sql, values);

    return this.findByReportId(id);
  }

  // ===== ELIMINAR =====
  async deleteReport(id: number) {
    await this.db.getPool().query('DELETE FROM reports WHERE id = ?', [id]);
    return { message: 'Reporte eliminado correctamente' };
  }

  async updateReportStatus(id: number, statusId: number): Promise<Report | null> {
    const sql = `UPDATE reports SET status_id = ?, updated_at = NOW() WHERE id = ?`;
    const values = [statusId, id];
    await this.db.getPool().query(sql, values);
    return this.findByReportId(id);
  }
}
