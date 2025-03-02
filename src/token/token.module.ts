import { Module } from '@nestjs/common';
import { TokenService } from './token.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenSchema } from '../../schema/token.schem.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "refresh token", schema: RefreshTokenSchema }]),
        JwtModule.register({}),
    ],
    providers: [
        TokenService
    ],
    exports: [
        TokenService
    ]
})

export class TokenModule {}
