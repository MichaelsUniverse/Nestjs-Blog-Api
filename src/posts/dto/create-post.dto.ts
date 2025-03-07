import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @Length(6, 24)
    title: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 254)
    content: string;
}
