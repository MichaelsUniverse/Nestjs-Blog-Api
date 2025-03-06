import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TokenModule } from '../token/token.module';
import { RefreshTokenSchema } from '../../schema/token.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "user", schema: UserSchema },
            { name: "refreshtoken", schema: RefreshTokenSchema }
        ]),
        JwtModule.register({}),
        TokenModule
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        JwtStrategy
    ],
})

export class AuthModule {}
