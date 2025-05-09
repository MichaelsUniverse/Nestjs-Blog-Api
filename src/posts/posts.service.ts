import { HttpStatus, Injectable } from '@nestjs/common';
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

        // Create a new post

        const post = new this.postModel({
            user,
            username: user.username,
            ...createPostDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Save post

        await post.save();

        return {
            msg: 'Post created successfully',
            post_id: post._id,
            status: HttpStatus.CREATED,
        };
    }

    getAllUserPosts(user: User) {
        return this.postModel.find({ user }).exec();
    }

    async update(id: string, user: User, updatePostDto: UpdatePostDto) {

        // Get post by ID and user

        const post = await this.postModel.findOne({
            _id: id
        });

        // Check if the post exists

        if (!post) {
            return {
                msg: 'Post not found',
                status: HttpStatus.NOT_FOUND,
            };
        }

        // Checking if the user is the owner of the post

        if (post.username !== user.username) {
            return {
                msg: 'You are not authorized to update this post',
                status: HttpStatus.UNAUTHORIZED,
            };
        }

        // Update the post

        try {

            await post.updateOne({
                $inc: { __v: 1 },
                updatedAt: new Date(),
                ...updatePostDto,
            });

        } catch (error) {
            // If error, throw an HttpException

            return {
                msg: error.codeName,
                status: HttpStatus.BAD_REQUEST,
            };
        }

        return {
            msg: 'Post updated successfully',
            status: HttpStatus.ACCEPTED,
        };
    }

    async remove(id: string, user: User) {

        // Get post by ID and user

        const post = await this.postModel.findOne({
            _id: id
        });

        // Check if the post exists

        if (!post) {
            return {
                msg: 'Post not found',
                status: HttpStatus.NOT_FOUND,
            };
        }

        // Checking if the user is the owner of the post

        if (post.username !== user.username) {
            return {
                msg: 'You are not authorized to delete this post',
                status: HttpStatus.UNAUTHORIZED,
            };
        }

        // Delete the post

        try {
            await post.deleteOne();
        } catch (error) {
            // If error, throw an HttpException

            return {
                msg: error.codeName,
                status: HttpStatus.BAD_REQUEST,
            };
        }

        return {
            msg: 'Post deleted successfully',
            status: HttpStatus.ACCEPTED,
        };
    }
}
