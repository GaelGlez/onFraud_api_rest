/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";
import { UsersRepository } from "./users.repository";

@Module({
    controllers: [UsersController],
    providers: [UserService, UsersRepository],
    exports: [UserService],
})
export class UsersModule {}