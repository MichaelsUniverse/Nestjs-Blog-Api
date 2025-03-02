import { HttpException, HttpStatus, Injectable, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";

export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService) {
        super();
    }

    handleRequest(err, user, test, context) {

        if (err || !user) {
            return false;
        }

        return user;
    }
}