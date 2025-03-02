import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "../../../schema/user.schema.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(@InjectModel('user') private user: Model<User>, config: ConfigService) {

        const jwtSecret = config.get('JWT_ACCESS_SECRET');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: { sub: string }){

        console.log("USER")
        console.log(payload)

        const user = await this.user.findOne({
            _id: payload.sub,
        });

        if (!user) {
            throw new Error('User not found');
        }

        const { hash, ...userWithoutHash } = user.toObject();

        return userWithoutHash;
    }
};