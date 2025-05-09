import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetUser } from '../user/decorator/get-user.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schema/user.schema';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostsController {
    constructor(@InjectModel('user') user: Model<User>, private readonly postsService: PostsService) {}

    @Post('create')
    create(@GetUser() user: User, @Body() createPostDto: CreatePostDto) {
        return this.postsService.create(user, createPostDto);
    }

    @Get('all')
    getAllUserPosts(@GetUser() user: User) {
        return this.postsService.getAllUserPosts(user);
    }

    @Patch('/update/:id')
    update(@Param('id') id: string, @GetUser() user: User, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(id, user, updatePostDto);
    }

    @Delete('/delete/:id')
    remove(@Param('id') id: string, @GetUser() user: User) {
        return this.postsService.remove(id, user);
    }
}
