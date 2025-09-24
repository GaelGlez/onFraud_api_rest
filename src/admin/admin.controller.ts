import { Body, Controller, Put, Get, Param  } from "@nestjs/common";
import { UserService } from "../users/users.service";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";

export class UpdateUserDto {
    id: number;
    email: string;
    name: string;
}

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
            name: user.name, 
            email: user.email
        };
    }

    @Get('users')
    async findAllUsers(@Param() params: any){
        const users = await this.userService.findAllUsers();
        if (!users) return null;
        return users.map(user => ({
            name: user.name,
            email: user.email
        }));
    }
}



