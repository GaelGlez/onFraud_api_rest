import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, IsInt } from 'class-validator';

export class CreateReportDto {
    @ApiProperty({ example: 'Oferta Cancún All Inclusive', description: 'Título del reporte', required: true })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: 3, description: 'ID de la categoría' })
    @IsInt()
    category_id: number;

    /*@ApiProperty({ example: 1, description: 'ID del usuario que crea el reporte', required: false })
    @IsOptional()
    @IsInt()
    user_id?: number;*/   // opcional si permites anónimos

    /*@ApiProperty({ example: 2, description: 'ID del status inicial', required: false })
    @IsOptional()
    @IsInt()
    status_id?: number; */ // podrías setearlo en el servicio por defecto (ej. pendiente)

    @ApiProperty({ example: 'https://comprasexpress.com/cancun' })
    @IsOptional()
    @IsUrl()
    url?: string;

    @ApiProperty({
        example: 'Ofrecen paquete Cancún por $999, piden transferencia y no entregan comprobante…',
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ type: [String], required: false })
    evidences?: string[];
}
