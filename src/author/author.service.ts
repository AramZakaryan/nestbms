import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateAuthorDto } from './dto/create-author.dto'
import { UpdateAuthorDto } from './dto/update-author.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Author } from './entities/author.entity'
import { BookService } from '../book/book.service'

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    // Check if author with the same name already exists
    const existAuthor = await this.authorRepository.findOneBy({
      name: createAuthorDto.name,
    })
    if (existAuthor) throw new BadRequestException('the author already exists')

    return await this.authorRepository
      .save({
        name: createAuthorDto.name,
        biography: createAuthorDto.biography,
        date_of_birth: createAuthorDto.date_of_birth,
      })
      .catch(
        () =>
          new BadRequestException(
            'something went wrong, contact the system administrator',
          ),
      )
  }

  async findAll() {
    return await this.authorRepository.find()
  }

  async findOne(id: number) {
    return await this.authorRepository.findOneBy({ id })
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    // Check if author with the id exists
    const author = await this.authorRepository.findOneBy({ id })
    if (!author) throw new BadRequestException('the author does not exist')

    return await this.authorRepository
      .update(id, {
        name: updateAuthorDto.name,
        biography: updateAuthorDto.biography,
        date_of_birth: updateAuthorDto.date_of_birth,
      })
      .catch(
        () =>
          new BadRequestException(
            'something went wrong, contact the system administrator',
          ),
      )
  }

  // err.driverError.errno == 1451
  async remove(id: number) {
    return await this.authorRepository.delete(id).catch((err) => {
      if (err.driverError.errno == 1451) {
        throw new BadRequestException(
          'all the books of the author should be deleted before delete the author',
        )
      } else {
        throw new BadRequestException(
          'something went wrong, contact the system administrator',
        )
      }
    })
  }
}
