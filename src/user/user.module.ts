import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schema/index';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "user", schema: UserSchema }]),
    ],
    controllers: [UserController],
    providers: [UserService],
})

export class UserModule {}
