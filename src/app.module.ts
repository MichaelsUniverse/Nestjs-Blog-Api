import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('MONGODB_URI')
            }),
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UserModule,
        AuthModule,
        TokenModule
    ]
})
export class AppModule {}
