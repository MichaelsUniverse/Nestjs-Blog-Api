import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('user') private userModel: Model<User>,
        private jwt:JwtService,
        private config:ConfigService
    ) {}

    async loginUser(loginDto: LoginDto) {

        // Find user

        const user = await this.userModel.findOne({
            email: loginDto.email,
        });

        // Check if user exists

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // Check if password is valid

        const isPasswordValid = bcrypt.compareSync(loginDto.password, user.hash);

        // If password is invalid, throw an HttpException

        if (!isPasswordValid) {
            throw new HttpException('Invalid Credentials', HttpStatus.NOT_FOUND);
        }

        // If password is valid, generate and return tokens

        const userId = user._id.toString();

        return {
            accessToken: await this.userAccessToken(userId, user.email),
            refreshToken: await this.userRefreshToken(userId),
        };
    }

    async registerUser(registerDto: RegisterDto) {

        // Checking if email or username is already in use

        if (await this.userModel.findOne({ email: registerDto.email })) {
            throw new HttpException('Email In Use', HttpStatus.CONFLICT);
        }

        if (await this.userModel.findOne({ username: registerDto.username })) {
            throw new HttpException('Username Taken', HttpStatus.CONFLICT);
        }

        // Seperating password from the rest of the user object

        const { password, ...userWithoutPassword } = registerDto;

        // Hashing the password

        const hash = bcrypt.hashSync(registerDto.password, 14);

        try {

            // Saving the user to the database

            const user = await this.userModel.create({
                ...userWithoutPassword,
                hash,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Generating and returning tokens

            const userId = user._id.toString();

            return {
                accessToken: await this.userAccessToken(userId, user.email),
                refreshToken: await this.userRefreshToken(userId),
            };

        } catch (error) {
            throw new Error(error);
        }
    }

    async userAccessToken(userId: string, userEmail: string) {

        const payload = {
            sub: userId
        }

        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_ACCESS_SECRET'),
        });

        return accessToken;
    }

    async userRefreshToken(userId: string) {

        const payload = {
            sub: userId,
            jti: uuidv4(),
        }

        const userRefreshToken = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '30d',
                secret: this.config.get('JWT_REFRESH_SECRET'),
            }
        );

        return userRefreshToken;
    };
}
