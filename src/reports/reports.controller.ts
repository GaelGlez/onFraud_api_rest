/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { CreateReportDto, UpdateReportDto, Report } from './dto/reports.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /*@Post()
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @Req() req: any,
  ): Promise<Report> {
    const userId: number = req?.user?.id ?? 1; // reemplaza 1 por tu lógica real de auth
    return this.reportsService.create(createReportDto, userId);
  }*/

    @Post()
  create(@Body() dto: CreateReportDto, @Req() req) {
    // si usas auth: const userId = req.user.id;
    const userId = req.user?.id || null;
    return this.reportsService.create(dto, userId);
  }

  @Put(':id')
  async updateReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportDto: UpdateReportDto,
  ): Promise<Report> {
    return this.reportsService.update(id, updateReportDto);
  }

  @Get(':id')
  async getReport(@Param('id', ParseIntPipe) id: number): Promise<Report> {
    return this.reportsService.findOne(id);
  }

  @Get()
  async listReports(): Promise<Report[]> {
    return this.reportsService.findAll();
  }
}
