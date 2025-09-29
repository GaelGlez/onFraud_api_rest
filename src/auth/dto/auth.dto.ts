import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";


export class loginUserDto {
    @ApiProperty({example:"user@example.com", required:true})
    @IsEmail({}, { message: "Debe ser un email válido" })
    email: string;

    @ApiProperty({example:"password", required:true})
    @IsString({ message: "Debe ser un string" })
    password: string;
}

export class refreshUserDto {
    @ApiProperty({example:"refresh_token", required:true})
    @IsString({ message: "Debe ser un string" })
    token: string;
}

export class UserProfile {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: "gaelglez@example.com" })
    email: string;
    @ApiProperty({ example: "Gael Glez" })
    full_name: string;
}

export type AccessPayload = {
    sub:string; //user id
    type:"access",
    profile:UserProfile
}

export type RefreshPayload = {
    sub:string; //user id
    type:"refresh",
}
