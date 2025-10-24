/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, IsInt, IsArray, MinLength, MaxLength } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    example: 'Oferta Cancún All Inclusive',
    description: 'Título breve y descriptivo del reporte.',
    required: true,
  })
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres.' })
  @MaxLength(100, { message: 'El título no puede exceder los 100 caracteres.' })
  title!: string;

  @ApiProperty({
    example: 3,
    description: 'ID de la categoría a la que pertenece el reporte.',
    required: true,
  })
  @IsInt({ message: 'El ID de la categoría debe ser un número entero.' })
  category_id!: number;

  @ApiProperty({
    example: 1,
    description: 'ID del estado inicial del reporte (por defecto puede ser "Pendiente").',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El ID del estado debe ser un número entero.' })
  status_id?: number;

  @ApiProperty({
    example: 'https://comprasexpress.com/cancun',
    description: 'URL sospechosa asociada al reporte. Debe ser válida.',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida.' })
  url?: string;

  @ApiProperty({
    example:
      'Ofrecen paquete Cancún por $999, piden transferencia y no entregan comprobante.',
    description: 'Descripción detallada del caso reportado.',
    required: true,
  })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
  @IsString({ message: 'La descripción debe ser texto.' })
  @MinLength(20, { message: 'La descripción debe tener al menos 20 caracteres.' })
  @MaxLength(1000, { message: 'La descripción no puede exceder los 1000 caracteres.' })
  description!: string;

  @ApiProperty({
    required: false,
    type: [String],
    example: ['file1.png', 'evidence_123.pdf'],
    description:
      'Lista opcional de evidencias (file_keys) que se asocian al reporte.',
  })
  @IsOptional()
  @IsArray({ message: 'Evidences debe ser un arreglo de strings.' })
  @IsString({ each: true, message: 'Cada evidencia debe ser una cadena.' })
  evidences?: string[];
}

export class UpdateReportDto {
  @ApiProperty({
    example: 'Nueva oferta en Cancún',
    required: false,
    description: 'Título del reporte (opcional).',
  })
  @IsOptional()
  @IsString({ message: 'El título debe ser texto.' })
  title?: string;

  @ApiProperty({
    example: 'El sitio ha cambiado de nombre, pero sigue siendo fraudulento.',
    required: false,
    description: 'Descripción actualizada del reporte (opcional).',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto.' })
  description?: string;

  @ApiProperty({
    example: 'https://comprasexpress-new.com',
    required: false,
    description: 'URL actualizada del sitio fraudulento (opcional).',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida.' })
  url?: string;

  @ApiProperty({
    example: 2,
    required: false,
    description: 'Nuevo ID de categoría (opcional).',
  })
  @IsOptional()
  @IsInt({ message: 'Debe ser un número entero.' })
  category_id?: number;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Nuevo ID de estado (opcional).',
  })
  @IsOptional()
  @IsInt({ message: 'Debe ser un número entero.' })
  status_id?: number;
}

export class Report {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 12 })
  user_id: number;

  @ApiProperty({ example: 3 })
  category_id: number;

  @ApiProperty({ example: 1 })
  status_id: number;

  @ApiProperty({ example: 'Oferta Cancún All Inclusive' })
  title: string;

  @ApiProperty({ example: 'https://comprasexpress.com/cancun' })
  url: string | null;

  @ApiProperty({
    example: 'Ofrecen paquete Cancún por $999 y no entregan comprobante.',
  })
  description: string | null;

  @ApiProperty({ example: '2025-10-21T17:20:00Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-10-21T17:30:00Z' })
  updated_at?: Date;
}

/**
 * Interfaz de categoría de reportes
 */
export class Categories {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Fraude en línea' })
  name: string;
}

export class CategoryDTO {
  @ApiProperty({ example: 'Nuevo nombre de categoría' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

