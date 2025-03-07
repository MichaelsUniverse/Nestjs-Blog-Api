import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from '../../schema/post.schema.js';
import { TokenModule } from '../token/token.module.js';
import { UserSchema } from '../../schema/user.schema.js';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'post', schema: PostSchema },
            { name: 'user', schema: UserSchema }
        ]),
        TokenModule
    ],
    controllers: [PostsController],
    providers: [PostsService],
})

export class PostsModule {}
