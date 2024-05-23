import { IsEmail, MinLength } from 'class-validator'

export class AuthDto {
  @IsEmail()
  email: string
  @MinLength(6, { message: 'password should be at least 6 characters' })
  password: string
}
