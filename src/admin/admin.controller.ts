import { Body, Controller, Put, Get, Param  } from "@nestjs/common";
import { UserService } from "../users/users.service";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "../users/dto/users.dto";


@Controller('admin')
export class AdminController {
    constructor(private readonly userService: UserService) {}

    /*@ApiOperation({summary: 'Actualizar Usuario (Admin)'}) // Descripción de la operación para Swagger
    @Put(':id')
    async updateUser(@Param('id') id: number, 
        @Body() updateUserDto: UpdateUserDto) {
            return this.userService.updateUser(
                //updateUserDto.email,
                //updateUserDto.name,
            )
    }*/

    @Get('users/:id')
    async findUserById(@Param('id') id: number){
        const user = await this.userService.findUserById(id);
        if (!user) return null;
        return {
            full_name: user.full_name, 
            email: user.email
        };
    }

    @Get('users')
    async findAllUsers(@Param() params: any){
        const users = await this.userService.findAllUsers();
        if (!users) return null;
        return users.map(user => ({
            full_name: user.full_name,
            email: user.email
        }));
    }

    @Put('users/:id')
    async updateUser(@Param('id') userId: number, @Body() updateDto: UpdateUserDto) {
        const updateUser = await this.userService.updateUser(userId, updateDto);

        if (!updateUser) return null;
        return {
            full_name: updateUser.full_name,
            email: updateUser.email
        };
    }
}



