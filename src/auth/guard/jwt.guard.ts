import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";

export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService) {
        super();
    }

    handleRequest(err, user, test, context) {

        const [bearer, token] = context.args[0].headers.authorization.split(' ');
        const authHeader = context.args[0].headers;

        if (!token) {
            console.log("token no", bearer, token);
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        console.log("token yes", bearer, token);

        if (err || !user) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }
}