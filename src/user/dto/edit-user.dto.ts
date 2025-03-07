import { IsEmail, IsOptional, IsString, Length, Matches } from "class-validator";

export class EditUserDto {
    @IsString()
    @IsOptional()
    @Length(6, 12, { message : "Username too short or too long" })
    username?: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @Length(4, 24)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, { message: "Password too weak" })
    password?: string;
}
