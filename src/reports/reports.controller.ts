/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, Delete, Query } from '@nestjs/common';
import { CreateReportDto, UpdateReportDto, Report } from './dto/reports.dto';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request";


@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // ====== CREACIÓN ======
  // Crear reporte como usuario autenticado
  @ApiOperation({ summary: 'Crear un reporte como usuario autenticado' })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createReport(@Body() dto: CreateReportDto, @Req() req) {
    const userId = Number(req.user.userId);  // <- ahora sí existe
    return this.reportsService.createReport(dto, userId);
  }

  // Crear reporte anónimo (sin autenticación)
  @ApiOperation({ summary: 'Crear un reporte anónimo' })
  @Post('anonymous')
  createAnonymousReport(@Body() dto: CreateReportDto) {
    return this.reportsService.createReport(dto, 0); // userId = 0 para anónimo
  }

  // ====== LECTURA ======
   // Listar reportes para el usuario autenticado
  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async listUserReports(@Req() req): Promise<Report[]> {
    const userId = Number(req.user.userId);
    return this.reportsService.findReportsByUser(userId);
  }
  // Listar reportes con filtros
  @Get()
  async listReports(
    @Query('category_id') categoryId?: number,
    @Query('status_id') statusId?: number,
    @Query('url') url?: string,
    @Query('q') keyword?: string
  ): Promise<Report[]> {
    return this.reportsService.findAllReports({ categoryId, statusId, url, keyword });
  }

  // Detalle de un reporte
  @Get(':id')
  async getReport(@Param('id', ParseIntPipe) id: number): Promise<Report> {
    return this.reportsService.findReportById(id);
  }

  // Detalle de reportes por status autenticado
  @Get('user/status/:statusId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async listUserReportsByStatus(@Param('statusId', ParseIntPipe) statusId: number, @Req() req): Promise<Report[]> {
    const userId = Number(req.user.userId);
    return this.reportsService.findReportsByUserAndStatus(userId, statusId);
  }

  // ====== EDICIÓN ======
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateReport(@Param('id', ParseIntPipe) id: number, @Body() updateReportDto: UpdateReportDto, @Req() req): Promise<Report> {
    const userId = Number(req.user.userId);
    return this.reportsService.updateReport(id, updateReportDto, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteReport(@Param('id', ParseIntPipe) id: number, @Req() req,) {
    const userId = Number(req.user.userId);
    return this.reportsService.deleteReport(id, userId);
  }

  // ====== EVIDENCIAS ======
  @Post(':id/evidences')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addEvidence(
    @Param('id', ParseIntPipe) reportId: number,
    @Body('files') files: string[], // nombres que ya se subieron en /files/upload
    @Req() req,
  ) {
    const userId = Number(req.user.userId);
    return this.reportsService.addEvidence(reportId, files, userId);
  }

  @Delete(':id/evidences/:evidenceId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteEvidence(
    @Param('id', ParseIntPipe) reportId: number,
    @Param('evidenceId', ParseIntPipe) evidenceId: number,
    @Req() req,
  ) {
    const userId = Number(req.user.userId);
    return this.reportsService.deleteEvidence(reportId, evidenceId, userId);
  }
}
