import { IsOptional, IsString, Matches } from "class-validator";

export class EditUserDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, { message: "Password too weak" })
    password?: string;
}
