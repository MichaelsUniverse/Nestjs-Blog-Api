import { IsOptional, IsString, Length } from "class-validator";

export class UpdatePostDto {
    @IsString()
    @IsOptional()
    @Length(6, 14)
    title: string;

    @IsString()
    @IsOptional()
    @Length(1, 254)
    content: string;
}
