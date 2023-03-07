import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthenticateViewerDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
