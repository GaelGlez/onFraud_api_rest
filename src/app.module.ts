import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { FileModule } from './files/file.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule } from '@nestjs/config';
import { DbService } from './db/db.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, UsersModule, ReportsModule, AuthModule, AdminModule, FileModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
  })],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
