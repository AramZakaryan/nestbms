import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { Author } from './entities/author.entity'
import { AuthorService } from './author.service'
import { CreateAuthorDto } from './dto/create-author.dto'

describe('AuthorService', () => {
  let service: AuthorService
  let authorRepository: Repository<Author>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: getRepositoryToken(Author),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AuthorService>(AuthorService)
    authorRepository = module.get<Repository<Author>>(
      getRepositoryToken(Author),
    )
  })

  describe('create', () => {
    it('should create a new author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'John Doe',
        biography: 'This is the biography of John Doe',
        date_of_birth: new Date('1980-01-01'),
      }

      jest.spyOn(authorRepository, 'save').mockResolvedValue({
        id: 1,
        name: createAuthorDto.name,
        biography: createAuthorDto.biography,
        date_of_birth: createAuthorDto.date_of_birth,
        book: undefined, // not specified here
      })

      const author = await service.create(createAuthorDto)

      expect(authorRepository.save).toHaveBeenCalledWith(createAuthorDto)
      expect(author).toEqual({
        id: 1,
        name: createAuthorDto.name,
        biography: createAuthorDto.biography,
        date_of_birth: createAuthorDto.date_of_birth,
      })
    })
  })

  describe('findOne', () => {
    it('should return an author by id', async () => {
      const authorId = 1
      const author: Author = {
        id: authorId,
        name: 'John Doe',
        biography: 'This is the biography of John Doe',
        date_of_birth: new Date('1980-01-01'),
        book: [],
      }

      jest.spyOn(authorRepository, 'findOneBy').mockResolvedValue(author)

      const foundAuthor = await service.findOne(authorId)

      expect(authorRepository.findOneBy).toHaveBeenCalledWith({ id: authorId })
      expect(foundAuthor).toEqual(author)
    })
  })

  describe('findAll', () => {
    it('should return all authors', async () => {
      const authors: Author[] = [
        {
          id: 1,
          name: 'John Doe',
          biography: 'This is the biography of John Doe',
          date_of_birth: new Date('1980-01-01'),
          book: [],
        },
        {
          id: 2,
          name: 'Jane Doe',
          biography: 'This is the biography of Jane Doe',
          date_of_birth: new Date('1985-05-05'),
          book: [],
        },
      ]

      jest.spyOn(authorRepository, 'find').mockResolvedValue(authors)

      const foundAuthors = await service.findAll()

      expect(authorRepository.find).toHaveBeenCalledWith()
      expect(foundAuthors).toEqual(authors)
    })
  })

  describe('remove', () => {
    it('should delete an author by id', async () => {
      const authorId = 1

      jest
        .spyOn(authorRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as DeleteResult)

      await service.remove(authorId)

      expect(authorRepository.delete).toHaveBeenCalledWith(authorId)
    })
  })
})
