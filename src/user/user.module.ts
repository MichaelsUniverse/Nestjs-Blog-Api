import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schema/user.schema';
import { TokenModule } from '../token/token.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "user", schema: UserSchema }]),
        TokenModule,
        JwtModule
    ],
    controllers: [
        UserController
    ],
    providers: [
        UserService
    ],
})

export class UserModule {}
