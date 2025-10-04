import { Body, Controller, Put, Get, Param, Query  } from "@nestjs/common";
import { UserService } from "../users/users.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "../users/dto/users.dto";
import { ReportsService } from "../reports/reports.service";

@ApiTags('Modulo de Administracion') // Agrupa los endpoints de este controlador bajo el tag "Modulo de Administracion"
@Controller('admin')
export class AdminController {
    constructor(private readonly userService: UserService, private readonly reportsService: ReportsService) {}

    @ApiOperation({summary: 'Buscar usuario por ID'}) // Descripción de la operación para Swagger
    @Get('users/:id')
    async findUserById(@Param('id') id: number){
        const user = await this.userService.findUserById(id);
        if (!user) return null;
        return {
            full_name: user.full_name, 
            email: user.email
        };
    }

    @ApiOperation({summary: 'Listar todos los usuarios'}) // Descripción de la operación para Swagger
    @Get('users')
    async findAllUsers(@Param() params: any){
        const users = await this.userService.findAllUsers();
        if (!users) return null;
        return users.map(user => ({
            full_name: user.full_name,
            email: user.email
        }));
    }

    @ApiOperation({summary: 'Actualizar Usuario (Admin)'}) // Descripción de la operación para Swagger
    @Put('users/:id')
    async updateUser(@Param('id') userId: number, @Body() updateDto: UpdateUserDto) {
        const updateUser = await this.userService.updateUser(userId, updateDto);

        if (!updateUser) return null;
        return {
            full_name: updateUser.full_name,
            email: updateUser.email
        };
    }

    //Reportes
    @Get('reports')
    async getReports(
        @Query('category_id') categoryId?: number,
        @Query('status_id') statusId?: number,
        @Query('url') url?: string,
        @Query('q') keyword?: string) {
        const reports = await this.reportsService.findAllReports({ categoryId, statusId, url, keyword });
        return reports;
    }
}



