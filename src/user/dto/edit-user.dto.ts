import { IsOptional, IsString, Length, Matches } from "class-validator";

export class EditUserDto {
    @IsString()
    @IsOptional()
    @Length(4, 8)
    username?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @Length(4, 8)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, { message: "Password too weak" })
    password?: string;
}
