import { IsEmail, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email: string
  @MinLength(6, { message: 'password should be at least 6 characters' })
  password: string
}
