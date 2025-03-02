import { Controller, Body, Patch, UseGuards, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { EditUserDto } from './dto/index';
import { GetUser } from './decorator/user.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schema/user.schema';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(@InjectModel('user') user: Model<User>, private readonly userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @HttpCode(HttpStatus.ACCEPTED)
    @Patch('edit')
    updateUser(@GetUser('_id') userId: string, @Body() updateUserDto: EditUserDto) {
        return this.userService.updateUser(userId, updateUserDto);
    }
}
