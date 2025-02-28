import { Injectable } from '@nestjs/common';
import { CreateUserDto, EditUserDto } from './dto/index';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schema/index';

@Injectable()
export class UserService {
    constructor(@InjectModel('user') private userModel: Model<User>) {}

    async updateUser(userId: number, updateUserDto: EditUserDto) {
        return {
            userId,
            ...updateUserDto,
        };
    }
}
