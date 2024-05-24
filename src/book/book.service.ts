import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Book } from './entities/book.entity'
import { Repository } from 'typeorm'
import { AuthorService } from '../author/author.service'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    private readonly authorService: AuthorService,
  ) {}

  async create(createBookDto: CreateBookDto) {
    // Check if book with the same title already exists
    const existBook = await this.bookRepository.findOneBy({
      title: createBookDto.title,
    })
    if (existBook) throw new BadRequestException('the book already exists')

    // Check if author exists
    const existAuthor = await this.authorService.findOne(
      createBookDto.author_id,
    )
    if (!existAuthor) throw new BadRequestException('the author does not exist')

    return await this.bookRepository
      .save({
        title: createBookDto.title,
        isbn: createBookDto.isbn,
        author_id: createBookDto.author_id,
      })
      .catch(
        () =>
          new BadRequestException(
            'something went wrong, contact the system administrator',
          ),
      )
  }

  async findAll() {
    return await this.bookRepository.find({ relations: { author: true } })
  }

  async findOne(id: number) {
    return await this.bookRepository.findOneBy({ id })
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    // Check if book with the id exists
    const existBook = await this.bookRepository.findOneBy({ id })
    if (!existBook) throw new BadRequestException('the book does not exist')

    return await this.bookRepository
      .update(id, {
        title: updateBookDto.title,
        isbn: updateBookDto.isbn,
        author_id: updateBookDto.author_id,
      })
      .catch(
        () =>
          new BadRequestException(
            'something went wrong, contact the system administrator',
          ),
      )
  }

  async remove(id: number) {
    return await this.bookRepository.delete(id)
  }
}
