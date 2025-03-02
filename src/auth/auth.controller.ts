import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    async registerUser(@Body() registerDto: RegisterDto) {
        return this.authService.registerUser(registerDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async loginUser(@Body() loginDto: LoginDto) {
        return this.authService.loginUser(loginDto);
    }
}
