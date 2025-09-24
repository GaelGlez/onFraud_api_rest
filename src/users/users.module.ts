/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";
import { UsersRepository } from "./users.repository";
import { TokenService } from '../auth/token.service'; 


@Module({
    controllers: [UsersController],
    providers: [UserService, UsersRepository, TokenService],
    exports: [UserService],
})
export class UsersModule {}