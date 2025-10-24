import { Injectable, UnauthorizedException } from "@nestjs/common";    
import { JwtService } from "@nestjs/jwt";
import { UserProfile, AccessPayload, RefreshPayload } from "./dto/auth.dto";

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
            secret:process.env.JWT_SECRET,
            expiresIn:process.env.JWT_EXPIRES 
        })
    }
    async generateRefreshToken(profile:UserProfile):Promise<string>{
        return this.jwtService.signAsync({
            sub:profile.id.toString(),
            type:"refresh",
        } satisfies RefreshPayload,
        {
            secret:process.env.JWT_SECRET,
            expiresIn:process.env.JWT_REFRESH_EXPIRES
        })
    }
    async verifyAccessToken(token:string):Promise<AccessPayload>{
        const payload = await this.jwtService.verifyAsync<AccessPayload>(token,{
            secret:process.env.JWT_SECRET
        });
        if(payload.type !== "access"){
            throw new UnauthorizedException("Token inválido");
        }
        return payload;
    }
    async verifyRefreshToken(token:string):Promise<RefreshPayload>{
        const payload = await this.jwtService.verifyAsync<RefreshPayload>(token,{
            secret:process.env.JWT_SECRET
        });
        if(payload.type !== "refresh"){
            throw new UnauthorizedException("Token inválido");
        }
        return payload;
    }
}


