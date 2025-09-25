import { ApiProperty } from "@nestjs/swagger";


export class UpdateUserDto {
    @ApiProperty({example:"gael@example.com", required:false}) // Descripción de la propiedad para Swagger
    email?: string; // opcional
    @ApiProperty({example:"Gael", required:false})
    full_name?: string;  // opcional
}

export class CreateUserDto {
    @ApiProperty({example:"gael@example.com", required:true}) // Descripción de la propiedad para Swagger
    email: string;
    @ApiProperty({example:"Gael", required:true})
    full_name: string;
    @ApiProperty({example:"123456", required:true})
    password: string;
};
