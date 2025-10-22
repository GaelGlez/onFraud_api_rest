/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards, Delete, Query } from '@nestjs/common';
import { CreateReportDto, Report, Categories } from './dto/reports.dto';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request';
import { Evidence } from 'src/files/dto/file.dto';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // ====== CREACIÓN ======
  // Crear un reporte (usuario autenticado)
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un reporte (usuario autenticado)' })
    @ApiResponse({
      status: 201,
      description: 'Reporte creado exitosamente.',
      type: Report,
    })
    @ApiResponse({ status: 401, description: 'Token inválido o ausente.' })
    createReport(@Body() dto: CreateReportDto, @Req() req: AuthenticatedRequest) {
      const userId = Number(req.user.userId);
      return this.reportsService.createReport(dto, userId);
    }

  // Crear un reporte anónimo (sin autenticación)
  @Post('anonymous')
  @ApiOperation({ summary: 'Crear un reporte anónimo (sin autenticación)' })
  @ApiResponse({
    status: 201,
    description: 'Reporte anónimo creado exitosamente.',
    type: Report,
  })
  createAnonymousReport(@Body() dto: CreateReportDto) {
    return this.reportsService.createReport(dto, 0);
  }

  // ====== LECTURA ======
  // Listar categorías
  @Get('categories')
  @ApiOperation({ summary: 'Listar categorías disponibles para reportes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías disponibles.',
    type: [Categories],
  })
  async listCategories(): Promise<Categories[]> {
    return this.reportsService.findAllCategories();
  }
  
  // Listar reportes con filtros
  @Get()
  @ApiOperation({
    summary: 'Listar reportes (con filtros opcionales)',
    description:
      'Permite filtrar por categoría, estado, URL o palabra clave en título/descripción.',
  })
  @ApiQuery({
    name: 'category_id',
    required: false,
    type: Number,
    description: 'Filtra por ID de categoría.',
  })
  @ApiQuery({
    name: 'status_id',
    required: false,
    type: Number,
    description: 'Filtra por ID de estado.',
  })
  @ApiQuery({
    name: 'url',
    required: false,
    type: String,
    description: 'Filtra por URL asociada.',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Palabra clave a buscar en título o descripción.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reportes filtrada según los criterios.',
    type: [Report],
  })
  async listReports(
    @Query('category_id') categoryId?: number,
    @Query('status_id') statusId?: number,
    @Query('url') url?: string,
    @Query('q') keyword?: string,
  ): Promise<Report[]> {
    return this.reportsService.findAllReports({
      categoryId,
      statusId,
      url,
      keyword,
    });
  }

  // Listar reportes del usuario autenticado con filtro opcional por estado
  @Get('user/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar reportes creados por el usuario autenticado',
  })
  @ApiQuery({
    name: 'status_id',
    required: false,
    type: Number,
    description: 'Filtra por estado (opcional).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reportes creados por el usuario.',
    type: [Report],
  })
  async listReportsUser(
    @Req() req: AuthenticatedRequest,
    @Query('status_id') statusId?: number,
  ): Promise<Report[]> {
    const userId = Number(req.user.userId);
    return this.reportsService.findAllReportsUser(userId, { statusId });
  }

  // Detalle de un reporte
  // NO SE USA PARA NADA
  /*@Get(':id')
  async getReport(@Param('id', ParseIntPipe) id: number): Promise<Report> {
    return this.reportsService.findReportById(id);
  }*/

  // ====== EDICIÓN ======
  // No se usa en nada 
  /*@Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateReport(@Param('id', ParseIntPipe) id: number, @Body() updateReportDto: UpdateReportDto, @Req() req): Promise<Report> {
    const userId = Number(req.user.userId);
    return this.reportsService.updateReport(id, updateReportDto, userId);
  }*/

  // ====== ELIMINACIÓN ======
  // Eliminar un reporte propio (usuario autenticado)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar un reporte propio (usuario autenticado)',
  })
  @ApiResponse({ status: 200, description: 'Reporte eliminado correctamente.' })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene permisos para eliminar este reporte.',
  })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado.' })
  async deleteReport(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    return this.reportsService.deleteReport(id, userId);
  }

  // ====== EVIDENCIAS ======
  // Listar evidencias de un reporte
  @Get(':id/evidences')
  @ApiOperation({
    summary: 'Obtener evidencias asociadas a un reporte específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de evidencias del reporte.',
    type: [Evidence],
  })
  async getEvidences(@Param('id', ParseIntPipe) reportId: number) {
    return this.reportsService.getEvidences(reportId);
  }
  
  // NO SE USA PARA NADA
  /*@Post(':id/evidences')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addEvidence(
    @Param('id', ParseIntPipe) reportId: number,
    @Body('files') files: string[], // nombres que ya se subieron en /files/upload
    @Req() req,
  ) {
    const userId = Number(req.user.userId);
    return this.reportsService.addEvidence(reportId, files, userId);
  }*/

  // NO SE USA PARA NADA
  /*@Delete(':id/evidences/:evidenceId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteEvidence(
    @Param('id', ParseIntPipe) reportId: number,
    @Param('evidenceId', ParseIntPipe) evidenceId: number,
    @Req() req,
  ) {
    const userId = Number(req.user.userId);
    return this.reportsService.deleteEvidence(reportId, evidenceId, userId);
  }*/
}
