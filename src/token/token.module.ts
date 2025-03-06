import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenSchema } from '../../schema/token.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "refreshtoken", schema: RefreshTokenSchema }]),
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
