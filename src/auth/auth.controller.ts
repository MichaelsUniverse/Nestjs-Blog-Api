import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto.js';
import { register } from 'module';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @HttpCode(201)
    @Post("register")
    async registerUser(@Body() registerDto: RegisterDto) {
        return this.authService.registerUser(registerDto);
    }

    @HttpCode(200)
    @Post('login')
    async loginUser() {
        return this.authService.loginUser();
    }
}
