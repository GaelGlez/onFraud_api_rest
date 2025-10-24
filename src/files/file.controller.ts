/* eslint-disable prettier/prettier */
import { Controller, Post, Delete, UploadedFile, UseInterceptors, HttpException, HttpStatus, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, resolve } from 'node:path';
import * as fs from 'node:fs';
import sanitize = require('sanitize-filename');
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FileUploadDto, DeleteFileDto, FileResponseDto } from './dto/file.dto';

@ApiTags('Archivos')
@Controller('files')
export class FileController {
  private readonly uploadRoot = resolve(__dirname, '../../public/uploads');

  // =============== SUBIR ARCHIVO ===============
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '../../public/uploads'),
        filename: (req, file, cb) => {
          const safeName = sanitize(file.originalname.replaceAll(/\s+/g, ''));
          cb(null, safeName);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Subir un archivo' })
  @ApiResponse({ status: 201, description: 'Archivo subido exitosamente.', type: FileResponseDto })
  @ApiResponse({ status: 400, description: 'No se proporcionó archivo.' })
  @ApiBody({ description: 'Archivo a subir', type: FileUploadDto })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    return {
      fileKey: file.filename,
      url: `http://localhost:3000/public/uploads/${file.filename}`,
    };
  }

  // =============== ELIMINAR ARCHIVO ===============
  @Delete('delete')
  @ApiOperation({ summary: 'Eliminar un archivo' })
  @ApiResponse({ status: 200, description: 'Archivo eliminado correctamente.' })
  @ApiResponse({ status: 400, description: 'Se requiere el nombre del archivo.' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error al eliminar archivo.' })
  async deleteFile(@Body() body: DeleteFileDto) {
    const { filename } = body;

    if (!filename) {
      throw new HttpException('Filename is required', HttpStatus.BAD_REQUEST);
    }

    // 1️⃣ Sanitizar nombre (quita caracteres peligrosos)
    const safeName = sanitize(filename);

    // 2️⃣ Construir ruta absoluta y normalizar
    const filePath = resolve(this.uploadRoot, safeName);

    // 3️⃣ Verificar que el archivo está dentro del directorio seguro
    if (!filePath.startsWith(this.uploadRoot)) {
      throw new HttpException('Invalid file path', HttpStatus.FORBIDDEN);
    }

    // 4️⃣ Verificar existencia
    if (!fs.existsSync(filePath)) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    // 5️⃣ Eliminar de forma segura
    try {
      fs.unlinkSync(fs.realpathSync(filePath));
      return { message: 'File deleted successfully' };
    } catch (error: any) {
      console.error('Error deleting file:', error.message || error);

      throw new HttpException(
        `Failed to delete file: ${error.message || 'unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
