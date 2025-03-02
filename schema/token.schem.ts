import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
    @Prop({
        required: true
    })
    userId: string;

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