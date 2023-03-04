import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator'

export class CreateViewerDto {
  @IsString()
  @Length(3)
  name: string

  @IsEmail()
  email: string

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  password: string
}
