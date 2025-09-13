import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { UserService } from "../users/users.service";
import { UsersRepository } from "../users/users.repository";