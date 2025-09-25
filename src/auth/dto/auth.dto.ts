import { ApiProperty, ApiBearerAuth } from "@nestjs/swagger";

export class loginUserDto {
    @ApiProperty({example:"user@example.com"})
    email: string;
    @ApiProperty({example:"password"})
    password: string;
}

export class refreshUserDto {
    @ApiProperty({example:"refresh_token"})
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
