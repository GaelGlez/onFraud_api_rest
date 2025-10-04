import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { UserService } from "../users/users.service";
import { UsersRepository } from "../users/users.repository";
import { ReportsService } from "../reports/reports.service";
import { ReportsRepository } from "src/reports/reports.repository";

@Module({
    controllers: [AdminController],
    providers: [UserService, UsersRepository, ReportsService, ReportsRepository],
    //exports: [UserService],
})
export class AdminModule {}