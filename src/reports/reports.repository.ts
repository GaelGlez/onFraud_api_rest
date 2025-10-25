/* eslint-disable prettier/prettier */
import { DbService } from '../db/db.service';
import { CreateReportDto, Report, Categories, CategoryDTO } from './dto/reports.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';


@Injectable()
export class ReportsRepository {
  constructor(private readonly db: DbService) {}

    // =============== CREAR REPORTE ===============
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

  // // =============== EVIDENCIAS ===============
  async findEvidencesByReportId(reportId: number) {
    const [rows]: any = await this.db
      .getPool()
      .query('SELECT * FROM reports_evidences WHERE reports_id = ?', [reportId]);
    return rows;
  }

  async addEvidence(reportId: number, fileKey: string, filePath: string, fileType: string) {
    await this.db.getPool().query(
      `INSERT INTO Reports_evidences (reports_id, file_key, file_path, file_type)
      VALUES (?, ?, ?, ?)`,
      [reportId, fileKey, filePath, fileType],
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

  // // =============== CONSULTAS DE REPORTES ===============
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

  async findAllReportsUser(
    userId: number,
    filters: { statusId?: number }
  ): Promise<Report[]> {
    const conditions: string[] = ['r.user_id = ?'];
    const values: any[] = [userId];

    if (filters.statusId) {
      conditions.push('r.status_id = ?');
      values.push(filters.statusId);
    }

    const sql = `
      SELECT 
        r.*,
        u.full_name AS user_name,
        c.name AS category_name,
        s.name AS status_name
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN statuses s ON r.status_id = s.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY r.id DESC
    `;

    const [rows] = await this.db.getPool().query(sql, values);
    return rows as Report[];
  }

  async findAllReports(filters: {
    categoryId?: number;
    statusId?: number;
    url?: string;
    userFilter?: 'onlyAnonymous' | 'onlyUsers';
    userId?: number;
    keyword?: string;
    limit?: number;
    offset?: number;
  }): Promise<Report[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (filters.categoryId !== undefined) {
      conditions.push('category_id = ?');
      values.push(filters.categoryId);
    }
    if (filters.statusId !== undefined) {
      conditions.push('status_id = ?');
      values.push(filters.statusId);
    }
    if (filters.url !== undefined) {
      conditions.push('url = ?');
      values.push(filters.url);
    }

    // Filtro de usuario / anónimo
    if (filters.userFilter) {
      switch (filters.userFilter) {
        case 'onlyAnonymous':
          conditions.push('user_id IS NULL');
          break;
        case 'onlyUsers':
          conditions.push('user_id IS NOT NULL');
          break;
      }
    }

    // Filtro por usuario específico (si se pasa)
    if (filters.userId !== undefined) {
      conditions.push('user_id = ?');
      values.push(filters.userId);
    }

    // Filtro por keyword
    if (filters.keyword !== undefined) {
      const keyword = `%${filters.keyword.toLowerCase()}%`;
      conditions.push(`(
        LOWER(r.title) LIKE ? OR 
        LOWER(r.description) LIKE ? OR 
        LOWER(c.name) LIKE ? OR 
        LOWER(r.url) LIKE ?
      )`);
      values.push(keyword, keyword, keyword, keyword);
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

    sql += ' ORDER BY r.id DESC';

    if (filters.limit !== undefined) {
      sql += ' LIMIT ?';
      values.push(filters.limit);
    }
    if (filters.offset !== undefined) {
      sql += ' OFFSET ?';
      values.push(filters.offset);
    }

    const [rows] = await this.db.getPool().query(sql, values);
    return rows as Report[];
  }

  // ===== ELIMINAR REPORTE =====
  async deleteReport(id: number) {
    await this.db.getPool().query('DELETE FROM reports WHERE id = ?', [id]);
    return { message: 'Reporte eliminado correctamente' };
  }

  // ===== ACTUALIZAR ESTADO REPORTE =====
  async updateReportStatus(id: number, statusId: number): Promise<Report | null> {
    const sql = `UPDATE reports SET status_id = ?, updated_at = NOW() WHERE id = ?`;
    const values = [statusId, id];
    await this.db.getPool().query(sql, values);
    return this.findByReportId(id);
  }

  // =====  CATEGORÍAS DE REPORTES =====
  async findAllCategories(): Promise<(Categories & { reportCount: number })[]> {
    const [rows]: any = await this.db.getPool().query(`
        SELECT 
            c.id, 
            c.name, 
            COUNT(r.id) AS reportCount
        FROM categories c
        LEFT JOIN reports r ON r.category_id = c.id
        GROUP BY c.id, c.name
        ORDER BY c.name ASC
    `);

    // Asegurarnos de que reportCount sea number
    return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        reportCount: Number(row.reportCount),
    }));
}


  async createCategory(dto: CategoryDTO) {
    const [result]: any = await this.db.getPool().query(
        'INSERT INTO categories (name) VALUES (?)', [dto.name]
    );
    return { id: result.insertId, name: dto.name };
  }

  async updateCategory(id: number, name: string) {
    await this.db.getPool().query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    return { id, name };
  }

  async deleteCategory(id: number) {
    // Contar cuántos reportes usan esta categoría
    const [rows]: any = await this.db
      .getPool()
      .query('SELECT COUNT(*) AS total FROM reports WHERE category_id = ?', [id]);

    const totalReports = rows[0]?.total || 0;

    // Lanzar excepción si hay reportes asociados
    if (totalReports > 0) {
      throw new HttpException(
        `No se puede eliminar la categoría porque tiene ${totalReports} reporte(s) asociado(s).`,
        HttpStatus.BAD_REQUEST
      );
    }

    // Si no hay reportes, borrar la categoría
    await this.db.getPool().query('DELETE FROM categories WHERE id = ?', [id]);

    return { message: `Categoría ${id} eliminada correctamente` };
  }
}