import { IsNotEmpty, Length, MaxLength } from 'class-validator'

export class CreateBookDto {
  @IsNotEmpty({ message: 'the book should have a title' })
  @MaxLength(250, {
    message: 'length of title should be less than 250 characters',
  })
  title: string

  @IsNotEmpty({ message: 'isbn should not be empty' })
  @Length(8, 13, { message: 'ISBN should be between 8 and 13 characters' })
  isbn: string

  @IsNotEmpty({ message: 'author id should be defined' })
  author_id: number
}
