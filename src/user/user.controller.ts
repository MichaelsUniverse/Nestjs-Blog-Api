import { Controller, Get, Post, Body, Put, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, EditUserDto } from './dto/index';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Patch(':id')
    updateUser(@Param('id') userId: number, @Body() updateUserDto: EditUserDto) {
        return this.userService.updateUser(userId, updateUserDto);
    }
}
