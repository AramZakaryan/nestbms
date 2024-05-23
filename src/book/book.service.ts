import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Book } from './entities/book.entity'
import { Repository } from 'typeorm'
import { Author } from '../author/entities/author.entity'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    // Check if book with the same title already exists
    const existBook = await this.bookRepository.findOneBy({
      title: createBookDto.title,
    })
    if (existBook) throw new BadRequestException('the book already exists')

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
