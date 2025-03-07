import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema.js';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    })
    user: User;

    @Prop({
        required: true
    })
    title: string;

    @Prop({
        required: true
    })
    content: string;

    @Prop({
        required: true
    })
    createdAt: Date;

    @Prop({
        required: true
    })
    updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);