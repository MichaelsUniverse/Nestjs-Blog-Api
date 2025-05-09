import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EditUserDto } from './dto/edit-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel('user') private userModel: Model<User>) {}

    async updateUser(userId: string, updateUserDto: EditUserDto) {

        // Check if no details are provided

        if (!updateUserDto.email && !updateUserDto.username && !updateUserDto.password) {
            throw new HttpException('No Details Provided', HttpStatus.BAD_REQUEST);
        }

        const { email, username, password } = updateUserDto;

        const usernameTaken = await this.userModel.findOne({ username });
        const emailTaken = await this.userModel.findOne({ email });

        // Check if username is already in use

        if (usernameTaken) {
            throw new HttpException('Username Taken', HttpStatus.CONFLICT);
        }

        // Check if email is already in use

        if (emailTaken) {
            throw new HttpException('Email In Use', HttpStatus.CONFLICT);
        }

        // If password is provided

        if (password) {

            // Hash new password

            updateUserDto.password = await bcrypt.hash(password, 12);

        }

        try {

            // Find and update user

            await this.userModel.findOneAndUpdate(
                { _id: userId },
                {
                    $inc: { __v: 1 },
                    updatedAt: new Date(),
                    email: updateUserDto.email,
                    username: updateUserDto.username,
                    hash: updateUserDto.password,
                },
                { new: true }
            );

        } catch (error) {

            // If error, throw an HttpException

            throw new HttpException(error.codeName, HttpStatus.BAD_REQUEST);
        }

        return {
            message: 'User Updated',
            status: HttpStatus.OK,
        }
    }
}
