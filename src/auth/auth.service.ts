import { Injectable, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';

// @UseGuards()
@Injectable()
export class AuthService {

    async loginUser() {
        return {
            message: 'User logged in',
        };
    }

    async registerUser(registerDto: RegisterDto) {

        // Hashing the password

        const hash = bcrypt.hashSync(registerDto.password, 14);

        // Seperating password from the rest of the user object

        const { password, ...userWithoutPassword } = registerDto;

        return {
            message: 'User registered',
            ...userWithoutPassword,
        };
    }
}
