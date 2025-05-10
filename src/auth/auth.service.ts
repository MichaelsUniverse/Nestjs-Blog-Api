import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('user') private userModel: Model<User>,
        private jwt:JwtService,
        private config:ConfigService,
        private token: TokenService
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

        const accessToken = await this.token.generateTokens(userId, user.email);

        return {
            access_token: accessToken
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

        const hash = bcrypt.hashSync(registerDto.password, 12);

        try {

            // Saving the user to the database

            const newUser = new this.userModel({
                ...userWithoutPassword,
                hash,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await newUser.save();

        } catch (error) {
            // If error, throw an HttpException

            throw new HttpException(error.codeName, HttpStatus.BAD_REQUEST);
        }

        return {
            message: 'User Registered',
            status: HttpStatus.CREATED,
        };
    }
}
