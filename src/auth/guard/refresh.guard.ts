import { HttpException, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TokenService } from "../../token/token.service.js";

export class RefreshAuthGuard extends AuthGuard('jwt') {
    constructor(private tokenService: TokenService) {
        super();
    }

    handleRequest(err, user, test, context, info) {

        if (err || !user) {
            console.log("REFRESH GUARD")

            const [bearer, token] = context.args[0].headers.authorization.split(' ');

            if(!token || !bearer) {
                throw new HttpException('Token Invalid', HttpStatus.UNAUTHORIZED);
            }

            console.log(this.tokenService)

            this.tokenService.validateRefreshToken(token);

            // const decoded = this.jwtService.decode(token);

            throw new HttpException('Token Invalid', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }
}