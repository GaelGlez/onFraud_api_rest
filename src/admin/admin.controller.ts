import { Body, Controller, Put, Get, Param, Query, Post, Delete, BadRequestException } from "@nestjs/common";
import { UserService } from "../users/users.service";
import { ApiOperation, ApiTags, ApiParam, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { UpdateUserAdminDto, User } from "../users/dto/users.dto";
import { ReportsService } from "../reports/reports.service";
import { Report, Categories, CategoryDTO } from "src/reports/dto/reports.dto";

@ApiTags('Modulo de Administracion')
@Controller('admin')
export class AdminController {
    constructor(private readonly userService: UserService, private readonly reportsService: ReportsService) {}

    //=============== USUARIOS ===============
    @ApiOperation({ summary: 'Listar todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente', type: [User] })
    @Get('users')
    async findAllUsers() {
        const users = await this.userService.findAllUsers();
        if (!users) return null;
        return users.map(user => ({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
        }));
    }

    @ApiOperation({ summary: 'Actualizar Usuario (Admin)' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del usuario a actualizar' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente', type: UpdateUserAdminDto })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @Put('users/:id')
    async updateUser(@Param('id') userId: number, @Body() updateDto: UpdateUserAdminDto) {
        const updateUser = await this.userService.updateUserAdmin(userId, updateDto);
        if (!updateUser) return null;
        return {
            full_name: updateUser.full_name,
            email: updateUser.email,
        };
    }

    @ApiOperation({ summary: 'Eliminar usuario por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del usuario a eliminar' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @Delete('users/:id')
    async deleteUser(@Param('id') userId: number) {
        const user = await this.userService.findUserById(userId);
        if (!user) {
            return { status: 404, message: 'Usuario no encontrado' };
        }
        await this.userService.deleteUser(userId);
        return { status: 200, message: `Usuario ${user.full_name} eliminado correctamente` };
    }

    //=============== REPORTES ===============
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
        @Query('userFilter') userFilter?: 'onlyAnonymous' | 'onlyUsers', // nuevo
        @Query('user_id') userIdParam?: string,
        @Query('q') keyword?: string
    ) {
        const userId = userIdParam !== undefined ? Number(userIdParam) : undefined;
        if (userId !== undefined && isNaN(userId)) throw new BadRequestException('user_id inválido');
        const reports = await this.reportsService.findAllReports({
            categoryId,
            statusId,
            url,
            userFilter,
            userId,
            keyword
        });
        return reports;
    }

    @ApiOperation({ summary: 'Actualizar estado de un reporte (Admin)' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del reporte' })
    @ApiParam({ name: 'statusId', type: Number, description: 'Nuevo ID de estado del reporte' })
    @ApiResponse({ status: 200, description: 'Estado de reporte actualizado correctamente' })
    @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
    @Put('reports/:id/status/:statusId')
    async updateReportStatus(@Param('id') id: string, @Param('statusId') statusIdParam: string) {
        const reportId = Number(id);
        const statusId = Number(statusIdParam);
        if (isNaN(reportId) || isNaN(statusId)) throw new BadRequestException('ID inválido');

        const report = await this.reportsService.findReportById(reportId);
        if (!report) return null;

        return this.reportsService.updateReportStatus(reportId, statusId);
    }



    @ApiOperation({ summary: 'Eliminar reporte (Admin)' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del reporte a eliminar' })
    @ApiResponse({ status: 200, description: 'Reporte eliminado correctamente' })
    @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
    @Delete('reports/:id')
    async deleteReport(@Param('id') id: number) {
        const report = await this.reportsService.findReportById(id);
        if (!report) return null;
        await this.reportsService.deleteReportAdmin(id);
        return { message: `Reporte ${id} eliminado correctamente` };
    }

    //=============== CATEGORÍAS ===============
    @ApiOperation({ summary: 'Listar todas las categorías' })
    @ApiResponse({ status: 200, description: 'Categorías obtenidas correctamente', type: [Categories] })
    @Get('/categories')
    async findAllCategories() {
        return this.reportsService.findAllCategories();
    }

    @ApiOperation({ summary: 'Crear nueva categoría' })
    @ApiResponse({ status: 201, description: 'Categoría creada correctamente', type: Categories })
    @Post('/categories')
    async createCategory(@Body() dto: CategoryDTO) {
        return this.reportsService.createCategory(dto);
    }

    @ApiOperation({ summary: 'Actualizar categoría existente' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Categoría actualizada correctamente', type: Categories })
    @Put('/categories/:id')
    async updateCategory(@Param('id') id: string, @Body() dto: CategoryDTO) {
        const categoryId = Number(id);
        if (isNaN(categoryId)) throw new BadRequestException('ID inválido');

        return this.reportsService.updateCategory(categoryId, dto.name);
        }

    @Delete('/categories/:id')
    async deleteCategory(@Param('id') id: string) {
        const categoryId = Number(id);
        if (isNaN(categoryId)) throw new BadRequestException('ID inválido');

        return this.reportsService.deleteCategory(categoryId);
        }

    // =============== ESTADÍSTICAS ===============
    @ApiOperation({ summary: 'Obtener estadísticas de reportes' })
    @ApiResponse({ status: 200, description: 'Estadísticas de reportes obtenidas correctamente' })
    @Get('reports/stats')
    async getReportsStats() {
        const reports = await this.reportsService.findAllReports({});
        const pending = reports.filter(r => r.status_id === 1).length;
        const approved = reports.filter(r => r.status_id === 2).length;
        const rejected = reports.filter(r => r.status_id === 3).length;
        return { pending, approved, rejected, total: reports.length };
    }

    @ApiOperation({ summary: 'Obtener número de reportes por categoría' })
    @ApiResponse({ status: 200, description: 'Número de reportes por categoría obtenido correctamente' })
    @Get('reports/by-category')
    async getReportsByCategory() {
        const categories = await this.reportsService.findAllCategories();
        const reports = await this.reportsService.findAllReports({});
        const data = categories.map(c => ({
            category: c.name,
            count: reports.filter(r => r.category_id === c.id).length
        }));
        return data;
    }

    @ApiOperation({ summary: 'Obtener reportes recientes (los más recientes primero)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad de reportes a traer (por defecto 5)' })
    @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset para paginación (por defecto 0)' })
    @ApiResponse({ status: 200, description: 'Reportes recientes obtenidos correctamente', type: [Report] })
    @Get('reports/recent')
    async getRecentReports(
    @Query('limit') limit: number = 5,
    @Query('offset') offset: number = 0
    ) {
    const reports = await this.reportsService.findAllReports({ limit, offset });
    return reports;
    }
}





