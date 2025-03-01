import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 8)
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, { message: "Password too weak" })
    password: string;
}