import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from '../../schema/token.schem.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService,
        @InjectModel('refresh token') private refreshToken: Model<RefreshToken>,
    ) {}

    async generateTokens(userId: string, userEmail: string) {

        const refreshToken = await this.generateRefreshToken(userId);
        const refreshHash = bcrypt.hashSync(refreshToken, 8);

        const accessToken = await this.generateAccessToken(userId, refreshHash);

        await this.storeRefreshToken(userId, refreshHash);

        return accessToken;
    };

    async generateAccessToken(userId: string, refreshHash: string) {

        const payload = {
            sub: userId,
            refreshHash,
        }

        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: this.config.get('JWT_ACCESS_EXPIRATION'),
            secret: this.config.get('JWT_ACCESS_SECRET'),
        });

        return accessToken;
    }

    async generateRefreshToken(userId: string) {

        const payload = {
            sub: userId,
        }

        const userRefreshToken = await this.jwt.signAsync(
            payload,
            {
                expiresIn: this.config.get('JWT_REFRESH_EXPIRATION'),
                secret: this.config.get('JWT_REFRESH_SECRET'),
            }
        );

        return userRefreshToken;
    };

    async storeRefreshToken(userId: string, refreshHash: string) {

        const expirationDate = new Date();

        expirationDate.setDate(+expirationDate.getDate() + +this.config.get('JWT_REFRESH_EXPIRATION').split('d')[0]);

        const newRefreshToken = new this.refreshToken({
            userId,
            tokenHash: refreshHash,
            expires_at: expirationDate,
        });

        await newRefreshToken.save();
    };

    async validateRefreshToken(token) {

        const { sub, refreshHash, ...payload } = this.jwt.decode(token);

        console.log(refreshHash);

        const Token = await this.refreshToken.findOne({
            refreshHash: refreshHash
        });

        if (!Token) {
            console.log("NO USER")
        }

        console.log(Token);
    }
}
