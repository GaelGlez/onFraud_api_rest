import { Body, Controller, Post, Put } from "@nestjs/common";
import { CreateReportDto } from "./dto/reports.dto";

@Controller('reports')
export class ReportsController {
    constructor(
        
    ) {}

    @Post()
    async createReport(@Body() createReportDto: CreateReportDto){
        return 
    }
}