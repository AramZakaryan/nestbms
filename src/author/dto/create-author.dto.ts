import { IsNotEmpty, MaxLength } from 'class-validator'

export class CreateAuthorDto {
  @IsNotEmpty({ message: 'the author name should be mentioned' })
  @MaxLength(45, {
    message: 'the author name should be less than 45 characters',
  })
  name: string

  @IsNotEmpty({ message: 'the author biography should be mentioned' })
  @MaxLength(255, {
    message: 'the author biography should be less than 255 characters',
  })
  biography: string

  @IsNotEmpty({ message: `the author's date of birth should be mentioned` })
  date_of_birth: Date
}
