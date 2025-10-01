/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, IsInt } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ example: 'Oferta Cancún All Inclusive', description: 'Título del reporte', required: true })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 3, description: 'ID de la categoría' })
  @IsInt()
  category_id!: number;

  @ApiProperty({ example: 1, description: 'ID del status inicial', required: false })
  @IsOptional()
  @IsInt()
  status_id?: number;

  @ApiProperty({ example: 'https://comprasexpress.com/cancun' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({
    example: 'Ofrecen paquete Cancún por $999, piden transferencia y no entregan comprobante…',
  })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({ type: [String], required: false })
  evidences?: string[];
}

export class UpdateReportDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ required: false, example: 2 })
  @IsOptional()
  @IsInt()
  category_id?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  status_id?: number;
}

/**
 * Interfaz que representa un registro en la tabla reports
 */
export interface Report {
  id: number;
  user_id: number;
  category_id: number;
  status_id: number;
  title: string;
  url?: string | null;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
