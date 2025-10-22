import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary', description: 'Archivo a subir' })
    file: any;
}

export class DeleteFileDto {
    @ApiProperty({ example: 'foto1.png', description: 'Nombre del archivo a eliminar' })
    filename: string;
}

export class FileResponseDto {
    @ApiProperty({ example: 'foto1.png', description: 'Identificador del archivo (fileKey)' })
    fileKey: string;

    @ApiProperty({ example: 'http://localhost:3000/public/uploads/foto1.png', description: 'URL para acceder al archivo' })
    url: string;
}

export class Evidence{
    @ApiProperty({ example: 1, description: 'ID de la evidencia' })
    id: number;

    @ApiProperty({ example: 1, description: 'ID del reporte asociado' })
    report_id: number;

    @ApiProperty({ example: 'foto1.png', description: 'Clave del archivo (fileKey)' })
    file_key: string;

    @ApiProperty({ example: 'public/uploads/foto1.png', description: 'Ruta del archivo' })
    file_path: string;

    @ApiProperty({ example: '.png', description: 'Tipo de archivo' })
    file_type: string;
    
    @ApiProperty({ example: '2025-10-21T18:23:00Z', description: 'Fecha de subida del archivo' })
    uploaded_at: Date;
}
