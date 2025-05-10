import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    async getAllUserPosts(user: User) {

        try {

            const posts = await this.postModel.find({ user }).exec()

            return {
                msg: "Posts Retrieved",
                status: HttpStatus.OK,
                user_posts: posts
            }

        } catch (error) {
            throw new HttpException(error.codeName, HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, user: User, updatePostDto: UpdatePostDto) {

        // Making sure updatePostDto isnt empty

        if(!updatePostDto.title && !updatePostDto.content){
            throw new HttpException('No Details Provided', HttpStatus.BAD_REQUEST);
        }

        // Get post by ID and user

        const post = await this.postModel.findOne({
            _id: id
        });

        // Check if the post exists

        if (!post) {
            throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
        }

        // Checking if the user is the owner of the post

        if (post.username !== user.username) {
            throw new HttpException('You are not Authorized to edit this post', HttpStatus.UNAUTHORIZED);
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

            throw new HttpException(error.codeName, HttpStatus.BAD_REQUEST);
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
            throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
        }

        // Checking if the user is the owner of the post

        if (post.username !== user.username) {
            throw new HttpException('You are not Authorized to delete this post', HttpStatus.UNAUTHORIZED);
        }

        // Delete the post

        try {
            await post.deleteOne();
        } catch (error) {
            // If error, throw an HttpException

            throw new HttpException(error.codeName, HttpStatus.BAD_REQUEST);
        }

        return {
            msg: 'Post deleted successfully',
            status: HttpStatus.ACCEPTED,
        };
    }
}
