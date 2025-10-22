import { Body, Controller, Put, Get, Param, Query  } from "@nestjs/common";
import { UserService } from "../users/users.service";
import { ApiOperation, ApiTags, ApiParam, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { UpdateUserDto, User } from "../users/dto/users.dto";
import { ReportsService } from "../reports/reports.service";
import { Delete } from "@nestjs/common/decorators";
import { Report } from "src/reports/dto/reports.dto";

@ApiTags('Modulo de Administracion')
@Controller('admin')
export class AdminController {
    constructor(private readonly userService: UserService, private readonly reportsService: ReportsService) {}

    @ApiOperation({ summary: 'Buscar usuario por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado exitosamente' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado', type: User})
    @Get('users/:id')
    async findUserById(@Param('id') id: number) {
        const user = await this.userService.findUserById(id);
        if (!user) return null;
        return {
            full_name: user.full_name,
            email: user.email,
        };
    }


    @ApiOperation({ summary: 'Listar todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente', type: [User] })
    @Get('users')
    async findAllUsers() {
        const users = await this.userService.findAllUsers();
        if (!users) return null;
        return users.map(user => ({
            full_name: user.full_name,
            email: user.email,
        }));
    }


    @ApiOperation({ summary: 'Actualizar Usuario (Admin)' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del usuario a actualizar' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente', type: UpdateUserDto })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @Put('users/:id')
    async updateUser(@Param('id') userId: number, @Body() updateDto: UpdateUserDto) {
        const updateUser = await this.userService.updateUser(userId, updateDto);
        if (!updateUser) return null;
        return {
            full_name: updateUser.full_name,
            email: updateUser.email,
        };
    }

    //Reportes ---------------------------------------------------
    @ApiOperation({ summary: 'Listar reportes con filtros (Admin)' })
    @ApiQuery({ name: 'category_id', required: false, type: Number, description: 'Filtrar por categoría' })
    @ApiQuery({ name: 'status_id', required: false, type: Number, description: 'Filtrar por estado' })
    @ApiQuery({ name: 'url', required: false, type: String, description: 'Filtrar por URL sospechosa' })
    @ApiQuery({ name: 'q', required: false, type: String, description: 'Búsqueda general por palabra clave' })
    @ApiResponse({ status: 200, description: 'Lista de reportes obtenida correctamente', type: [Report] })
    @Get('reports')
    async getReports(
        @Query('category_id') categoryId?: number,
        @Query('status_id') statusId?: number,
        @Query('url') url?: string,
        @Query('q') keyword?: string
    ) {
        const reports = await this.reportsService.findAllReports({ categoryId, statusId, url, keyword });
        return reports;
    }


    @ApiOperation({ summary: 'Ver detalle de un reporte (Admin)' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del reporte' })
    @ApiResponse({ status: 200, description: 'Reporte encontrado', type: Report })
    @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
    @Get('reports/:id')
    async getReportById(@Param('id') id: number) {
        const report = await this.reportsService.findReportById(id);
        if (!report) return null;
        return report;
    }


    @ApiOperation({ summary: 'Actualizar estado de un reporte (Admin)' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del reporte' })
    @ApiParam({ name: 'statusId', type: Number, description: 'Nuevo ID de estado del reporte' })
    @ApiResponse({ status: 200, description: 'Estado de reporte actualizado correctamente' })
    @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
    @Put('reports/:id/status/:statusId')
    async updateReportStatus(@Param('id') reportId: number, @Param('statusId') statusId: number) {
        const report = await this.reportsService.findReportById(reportId);
        if (!report) return null;
        return this.reportsService.updateReportStatus(reportId, statusId);
    }


    @ApiOperation({ summary: 'Eliminar reporte (Admin)' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del reporte a eliminar' })
    @ApiQuery({ name: 'userId', type: Number, required: true, description: 'ID del usuario que realiza la eliminación' })
    @ApiResponse({ status: 200, description: 'Reporte eliminado correctamente' })
    @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
    @Delete('reports/:id')
    async deleteReport(@Param('id') id: number, @Query('userId') userId: number) {
        const report = await this.reportsService.findReportById(id);
        if (!report) return null;
        await this.reportsService.deleteReport(id, userId);
        return { message: `Reporte ${id} eliminado correctamente` };
    }
}



