import { Injectable } from '@nestjs/common'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Book } from './entities/book.entity'
import { Repository } from 'typeorm'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}
  create(createBookDto: CreateBookDto) {
    return this.bookRepository.save(createBookDto)
  }

  findAll() {
    return this.bookRepository.find()
  }

  findOne(id: number) {
    return this.bookRepository.findOneBy({ id })
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return this.bookRepository.update(id, updateBookDto)
  }

  remove(id: number) {
    return this.bookRepository.delete(id)
  }
}
