/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { CreateReportDto, UpdateReportDto, Report } from './dto/reports.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportsService {
  constructor(private readonly repo: ReportsRepository) {}

  // Crear un reporte
  /*create(dto: CreateReportDto, userId: number): Promise<Report> {
    return this.repo.createReport(dto, userId);
  }*/
    async create(dto: CreateReportDto, userId: number) {
    const reportId = await this.repo.createReport(dto, userId);

    if (dto.evidences && dto.evidences.length > 0) {
      const finalDir = path.join(__dirname, '../../public/uploads/reports', String(reportId));
      if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });

      for (const tmp of dto.evidences) {
        // tmp llega como 'nombre.jpg' (ya en public/uploads)
        const tmpPath = path.join(__dirname, '../../public/uploads', tmp);
        const destPath = path.join(finalDir, path.basename(tmp));

        fs.renameSync(tmpPath, destPath);

        await this.repo.addEvidence(
          reportId,
          `uploads/reports/${reportId}/${path.basename(tmp)}`,
          path.extname(tmp),
        );
      }
    }

    return this.repo.findById(reportId);
  }

  // Actualizar un reporte por id
  async update(id: number, dto: UpdateReportDto): Promise<Report> {
    const exists = await this.repo.findById(id);
    if (!exists) {
      throw new NotFoundException(`Reporte con id ${id} no encontrado`);
    }
    const updated = await this.repo.updateReport(id, dto);
    // updated puede ser null si dto estaba vacío; devolvemos el existente
    return updated ?? exists;
  }

  // Buscar un reporte por id
  async findOne(id: number): Promise<Report> {
    const report = await this.repo.findById(id);
    if (!report) {
      throw new NotFoundException(`Reporte con id ${id} no encontrado`);
    }
    return report;
  }

  // Listar todos los reportes
  findAll(): Promise<Report[]> {
    return this.repo.findAll();
  }
}
