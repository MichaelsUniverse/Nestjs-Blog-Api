import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    })
    user: User;

    @Prop({
        required: true
    })
    tokenHash: string;

    @Prop({
        required: true
    })
    expires_at: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });