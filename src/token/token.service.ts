import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from '../../schema/token.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService,
        @InjectModel('refreshtoken') private refreshToken: Model<RefreshToken>,
    ) {}

    async generateTokens(userId: string, userEmail: string) {

        const refreshToken = await this.generateRefreshToken(userId);
        const refreshHash = bcrypt.hashSync(refreshToken, 8);

        const accessToken = this.generateAccessToken(userId, refreshHash);

        await this.storeRefreshToken(userId, refreshHash);

        return accessToken;
    };

    generateAccessToken(userId: string, refreshHash: string) {

        const payload = {
            sub: userId,
            refreshHash,
        }

        const accessToken = this.jwt.sign(payload, {
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

    async storeRefreshToken(user: string, refreshHash: string) {

        const expirationDate = new Date();

        expirationDate.setDate(+expirationDate.getDate() + +this.config.get('JWT_REFRESH_EXPIRATION').split('d')[0]);

        const newRefreshToken = new this.refreshToken({
            user,
            tokenHash: refreshHash,
            expires_at: expirationDate,
        });

        await newRefreshToken.save();
    };

    async validateRefreshToken(payload) {

        // Obtain refresh token from database

        const refresh = await this.refreshToken.findOne({
            tokenHash: payload.refreshHash
        });

        // Check refresh token exists

        if (!refresh) {
            return false;
        }

        // Check refresh token has the correct userId

        // console.log('Refresh User: ', refresh.user);

        if (refresh.user.toString() !== payload.sub) {
            return false;
        }

        return true;
    }
}
