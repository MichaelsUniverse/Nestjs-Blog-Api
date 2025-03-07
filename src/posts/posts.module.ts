import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from '../../schema/post.schema';
import { TokenModule } from '../token/token.module';
import { UserSchema } from '../../schema/user.schema';

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
