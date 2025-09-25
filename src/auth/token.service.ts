import { Injectable } from "@nestjs/common";    
import { JwtService } from "@nestjs/jwt";

export type UserProfile = {
    id: number;
    email: string;
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

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    async generateAccessToken(profile:UserProfile): Promise<string> {
        return this.jwtService.signAsync({
            sub:profile.id.toString() ,
            type:"access",
            profile
        } satisfies AccessPayload,
        {
            //secret:process.env.JWT_SECRET,
            //expiresIn:process.env.JWT_EXPIRES
            secret:"supersecret",
            expiresIn:"1m"
        })
    }
    async generateRefreshToken(profile:UserProfile):Promise<string>{
        return this.jwtService.signAsync({
            sub:profile.id.toString(),
            type:"refresh",
        } satisfies RefreshPayload,
        {
            //secret:process.env.JWT_SECRET,
            //expiresIn:process.env.JWT_REFRESH_EXPIRES
            secret:"supersecret",
            expiresIn:"7d"
        })
    }
    async verifyAccessToken(token:string):Promise<AccessPayload>{
        const payload = await this.jwtService.verifyAsync<AccessPayload>(token,{
            //secret:process.env.JWT_SECRET
            secret:"supersecret"
        });
        if(payload.type !== "access"){
            throw new Error("Invalid token type");
        }
        return payload;
    }
    async verifyRefreshToken(token:string):Promise<RefreshPayload>{
        const payload = await this.jwtService.verifyAsync<RefreshPayload>(token,{
            //secret:process.env.JWT_SECRET
            secret:"supersecret"
        });
        if(payload.type !== "refresh"){
            throw new Error("Invalid token type");
        }
        return payload;
    }
}


