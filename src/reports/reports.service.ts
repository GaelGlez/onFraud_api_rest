/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ForbiddenException  } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { CreateReportDto, UpdateReportDto, Report } from './dto/reports.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  // ===== CREAR =====
  async createReport(dto: CreateReportDto, userId: number) {
    const reportId = await this.reportsRepository.createReport(dto, userId);

    if (dto.evidences && dto.evidences.length > 0) {
      const finalDir = path.join(__dirname, '../../public/uploads/reports', String(reportId));
      if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });

      for (const tmp of dto.evidences) {
        // tmp llega como 'nombre.jpg' (ya en public/uploads)
        const tmpPath = path.join(__dirname, '../../public/uploads', tmp);
        const destPath = path.join(finalDir, path.basename(tmp));

        fs.renameSync(tmpPath, destPath);

        await this.reportsRepository.addEvidence(
          reportId,
          `uploads/reports/${reportId}/${path.basename(tmp)}`,
          path.extname(tmp),
        );
      }
    }
    return this.reportsRepository.findByReportId(reportId);
  }

  // ===== LISTAR CON FILTROS =====
  async findAllReports(filters: {
    categoryId?: number;
    statusId?: number;
    url?: string;
    keyword?: string;
    limit?: number;
    offset?: number;
  }): Promise<Report[]> {
    return this.reportsRepository.findAllReports(filters);
  }

  // ===== DETALLE =====
  async findReportById(id: number): Promise<Report> {
    const report = await this.reportsRepository.findByReportId(id);
    if (!report) {
      throw new NotFoundException(`Reporte con id ${id} no encontrado`);
    }
    return report;
  }

  // ===== EDITAR (solo dueño + pendiente) =====
  async updateReport(id: number, dto: UpdateReportDto, userId: number): Promise<Report> {
    const report = await this.reportsRepository.findByReportId(id);
    if (!report) {
      throw new NotFoundException(`Reporte con id ${id} no encontrado`);
    }
    if (report.user_id !== userId) {
      throw new ForbiddenException(`No puedes editar un reporte que no es tuyo`);
    }
    if (report.status_id !== 1) {
      throw new ForbiddenException(`Solo se pueden editar reportes en estado pendiente`);
    }
    const updated = await this.reportsRepository.updateReport(id, dto);
    return updated ?? report;
  }

  // ===== ELIMINAR (solo dueño + pendiente) =====
  async deleteReport(id: number, userId: number) {
    const report = await this.reportsRepository.findByReportId(id);
    if (!report) throw new NotFoundException(`Reporte con id ${id} no encontrado`);
    if (report.user_id !== userId) throw new ForbiddenException(`No puedes eliminar un reporte que no es tuyo`);
    if (report.status_id !== 1) throw new ForbiddenException(`Solo se pueden eliminar reportes en estado pendiente`);

    return this.reportsRepository.deleteReport(id);
  }

   // ===== EVIDENCIAS =====
  async addEvidence(reportId: number, files: string[], userId: number) {
    const report = await this.reportsRepository.findByReportId(reportId);
    if (!report) throw new NotFoundException(`Reporte con id ${reportId} no encontrado`);
    if (report.user_id !== userId) throw new ForbiddenException(`No puedes modificar evidencias de un reporte ajeno`);
    if (report.status_id !== 1) throw new ForbiddenException(`Solo se pueden añadir evidencias si está pendiente`);

    const finalDir = path.join(__dirname, '../../public/uploads/reports', String(reportId));
    if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });

    for (const tmp of files) {
      const tmpPath = path.join(__dirname, '../../public/uploads', tmp);
      const destPath = path.join(finalDir, path.basename(tmp));

      fs.renameSync(tmpPath, destPath);

      await this.reportsRepository.addEvidence(
        reportId,
        `uploads/reports/${reportId}/${path.basename(tmp)}`,
        path.extname(tmp),
      );
    }

    return this.reportsRepository.findByReportId(reportId);
  }

  async deleteEvidence(reportId: number, evidenceId: number, userId: number) {
    const report = await this.reportsRepository.findByReportId(reportId);
    if (!report) throw new NotFoundException(`Reporte con id ${reportId} no encontrado`);
    if (report.user_id !== userId) throw new ForbiddenException(`No puedes eliminar evidencias de un reporte ajeno`);
    if (report.status_id !== 1) throw new ForbiddenException(`Solo se pueden eliminar evidencias si está pendiente`);

    const evidence = await this.reportsRepository.findEvidenceById(evidenceId);
    if (!evidence) {
      throw new NotFoundException(`Evidencia con id ${evidenceId} no encontrada`);
    }
    if (Number(evidence.report_id) !== reportId) {
      throw new ForbiddenException(`La evidencia no pertenece al reporte ${reportId}`);
    }

    // eliminar archivo físico
    const filePath = path.join(__dirname, '../../public', evidence.file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return this.reportsRepository.deleteEvidence(evidenceId);
  }
}
