import { Injectable, ConflictException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { CreateReportDto } from "./dto/reports.dto";

@Injectable()
export class ReportsRepository{
    constructor(private readonly db: DbService) {}

    async createReport(createReportDto: CreateReportDto, userId: number) { 
        const sql = 'INSERT INTO reports (user_id, category_id, status_id, title, url, description) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    }
}