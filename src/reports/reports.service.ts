/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { CreateReportDto, UpdateReportDto, Report } from './dto/reports.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly repo: ReportsRepository) {}

  // Crear un reporte
  create(dto: CreateReportDto, userId: number): Promise<Report> {
    return this.repo.createReport(dto, userId);
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
