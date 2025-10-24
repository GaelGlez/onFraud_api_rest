/* eslint-disable prettier/prettier */
import { Controller, Post, Delete, UploadedFile, UseInterceptors, HttpException, HttpStatus, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FileUploadDto, DeleteFileDto, FileResponseDto } from './dto/file.dto';

@ApiTags('Archivos')
@Controller('files')
export class FileController {

    // =============== SUBIR ARCHIVO ===============
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
        storage: diskStorage({
            destination: join(__dirname, '../../public/uploads'),
            filename: (req, file, cb) => {
            const name = file.originalname.replace(/\s+/g, '');
            cb(null, name);
            },
        }),
        }),
    )
    @ApiOperation({ summary: 'Subir un archivo' })
    @ApiResponse({ status: 201, description: 'Archivo subido exitosamente.', type: FileResponseDto })
    @ApiResponse({ status: 400, description: 'No se proporcionó archivo.' })
    @ApiBody({
        description: 'Archivo a subir',
        type: FileUploadDto,
    })
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

        const filePath = join(__dirname, '../../public/uploads', filename);

        if (!fs.existsSync(filePath)) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }

        try {
        fs.unlinkSync(filePath);
        return { message: 'File deleted successfully' };
        } catch (error) {
        throw new HttpException('Failed to delete file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
