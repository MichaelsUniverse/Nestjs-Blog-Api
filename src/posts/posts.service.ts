import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../schema/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
    constructor(@InjectModel('post') private postModel: Model<Post>) {}

    async create(user: User, createPostDto: CreatePostDto) {

        const post = new this.postModel({
            user,
            ...createPostDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await post.save();

        return {
            user,
            ...createPostDto,
        };
    }

    getAllUserPosts(user: User) {
        return this.postModel.findAll({ user});
    }

    update(id: number, updatePostDto: UpdatePostDto) {
        return `This action updates a #${id} post`;
    }

    remove(id: number) {
        return `This action removes a #${id} post`;
    }
}
