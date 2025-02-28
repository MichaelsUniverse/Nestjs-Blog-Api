import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('MONGODB_URI'),
                connectionFactory: (connection) => {
                    connection.on('connected', () => {
                        console.log('Connected to database');
                    });
                    connection.on('error', (error) => {
                        console.log(`Database connection error: ${error}`);
                    });
                    return connection;
                }
            }),
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UserModule,
        AuthModule
    ],
})
export class AppModule {}
