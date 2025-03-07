import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { TokenService } from "../../token/token.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private jwt: JwtService, private tokenService: TokenService, private config: ConfigService) {
        super();
    }

    handleRequest(err, user, _info, context) {

        if (err || !user) {

            const request = context.switchToHttp().getRequest();

            // If no authorization header, throw an HttpException

            if (!request.headers.authorization) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }

            const token = request.headers.authorization.split(' ')[1];

            // Checking if token is valid (excluding if its expired)

            if (!this.validateToken(token)) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }

            const payload = this.jwt.decode(token);

            const refreshIsValid = this.tokenService.validateRefreshToken(payload);

            return refreshIsValid.then((isValid) => {
                if (isValid) {

                    const newAccessToken = this.tokenService.generateAccessToken(payload.sub, payload.refreshHash);

                    console.log('New Access Token: ', newAccessToken);

                    return {
                        access_token: newAccessToken,
                        status: HttpStatus.FORBIDDEN,
                    };

                }

                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            });
        }
        return user;
    }

    validateToken(token) {
        try {

            const validToken = this.jwt.verify(token,  { secret: this.config.get('JWT_ACCESS_SECRET') });

        } catch (error) {

            if (error.name === 'TokenExpiredError') {
                return true;
            }

            return false;
        }
    }
}