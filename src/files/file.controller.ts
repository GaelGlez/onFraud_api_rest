/* eslint-disable prettier/prettier */

import { Controller, Post, Delete, UploadedFile, UseInterceptors, HttpException, HttpStatus, Body } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join } from "path";
import * as fs from "fs";

@Controller("files")
export class FileController {
    @Post("upload")
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: join(__dirname, "../../public/uploads"),
            filename: (req, file, cb) => {
                const name= file.originalname.replace(" ","");
                cb(null,name)
            }
        })
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return { fileKey: `${file.filename}`,
            url: `http://localhost:3000/public/uploads/${file.filename}` };
    }

    @Delete('delete')
    deleteFile(@Body('filename') filename: string) {
        if (!filename) {
            throw new HttpException('Filename is required', HttpStatus.BAD_REQUEST);
        }

        const filePath = join(__dirname, "../../public/uploads", filename);

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