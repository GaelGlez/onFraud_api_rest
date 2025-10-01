/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsRepository } from './reports.repository';
import { DbService } from '../db/db.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository, DbService],
  exports: [ReportsService],
})
export class ReportsModule {}
