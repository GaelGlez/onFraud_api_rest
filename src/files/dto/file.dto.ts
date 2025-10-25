import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDefined, IsDate, IsInt } from 'class-validator';

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary', description: 'Archivo a subir' })
    @IsDefined({ message: 'Se debe enviar un archivo' })
    @IsNotEmpty({ message: 'El archivo no puede estar vacío' })
    file: any;
}

export class DeleteFileDto {
    @ApiProperty({ example: 'foto1.png', description: 'Nombre del archivo a eliminar' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre del archivo no puede estar vacío' })
    filename: string;
}

export class FileResponseDto {
    @ApiProperty({ example: 'foto1.png', description: 'Identificador del archivo (fileKey)' })
    fileKey: string;

    @ApiProperty({ example: 'http://localhost:3000/public/uploads/foto1.png', description: 'URL para acceder al archivo' })
    url: string;
}

export class Evidence {
    @ApiProperty({ example: 1, description: 'ID de la evidencia' })
    @IsInt()
    id: number;

    @ApiProperty({ example: 1, description: 'ID del reporte asociado' })
    @IsInt()
    report_id: number;

    @ApiProperty({ example: 'foto1.png', description: 'Clave del archivo (fileKey)' })
    @IsString()
    @IsNotEmpty()
    file_key: string;

    @ApiProperty({ example: 'public/uploads/foto1.png', description: 'Ruta del archivo' })
    @IsString()
    @IsNotEmpty()
    file_path: string;

    @ApiProperty({ example: '.png', description: 'Tipo de archivo' })
    @IsString()
    @IsNotEmpty()
    file_type: string;

    @ApiProperty({ example: '2025-10-21T18:23:00Z', description: 'Fecha de subida del archivo' })
    @IsDate()
    uploaded_at: Date;
}
