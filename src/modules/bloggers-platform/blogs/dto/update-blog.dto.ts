import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateBlogDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  name: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
