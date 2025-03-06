import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
    @Prop({
        required: true,
        unique: true
    })
    username: string;

    @Prop({
        required: true,
        unique: true
    })
    email: string;

    @Prop({
        required: true
    })
    hash: string;

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