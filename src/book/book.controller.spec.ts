import { Test, TestingModule } from '@nestjs/testing'
import { BookController } from './book.controller'
import { BookService } from './book.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { Book } from './entities/book.entity'
import { Author } from '../author/entities/author.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UpdateResult } from 'typeorm'

describe('BookController', () => {
  let controller: BookController
  let service: BookService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<BookController>(BookController)
    service = module.get<BookService>(BookService)
  })

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        isbn: '9780123456789',
        author_id: 1,
      }

      const author = new Author()
      author.id = 1
      author.name = 'Test Author'

      const book = new Book()
      book.id = 1
      book.title = createBookDto.title
      book.isbn = createBookDto.isbn
      book.author_id = createBookDto.author_id
      book.author = author

      jest.spyOn(service, 'create').mockResolvedValue(book)

      const result = await controller.create(createBookDto)
      expect(result).toEqual(book)
      expect(service.create).toHaveBeenCalledWith(createBookDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const author = new Author()
      author.id = 1
      author.name = 'Test Author'

      const books = [
        {
          id: 1,
          title: 'Book 1',
          isbn: '9780123456789',
          author_id: 1,
          author: author,
        },
        {
          id: 2,
          title: 'Book 2',
          isbn: '9780987654321',
          author_id: 1,
          author: author,
        },
      ] as Book[]

      jest.spyOn(service, 'findAll').mockResolvedValue(books)

      const result = await controller.findAll()
      expect(result).toEqual(books)
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a book', async () => {
      const author = new Author()
      author.id = 1
      author.name = 'Test Author'

      const book = {
        id: 1,
        title: 'Test Book',
        isbn: '9780123456789',
        author_id: 1,
        author: author,
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(book)

      const result = await controller.findOne('1')
      expect(result).toEqual(book)
      expect(service.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        isbn: '9780987654321',
        author_id: 2,
      }

      const author = new Author()
      author.id = 2
      author.name = 'Updated Author'

      const book = {
        id: 1,
        title: updateBookDto.title,
        isbn: updateBookDto.isbn,
        author_id: updateBookDto.author_id,
        author: author,
      }

      jest
        .spyOn(service, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult)

      const result = await controller.update('1', updateBookDto)
      expect(result).toEqual({ affected: 1 } as UpdateResult)
      expect(service.update).toHaveBeenCalledWith(1, updateBookDto)
    })
  })

  describe('remove', () => {
    it('should delete a book', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined)

      await controller.remove('1')
      expect(service.remove).toHaveBeenCalledWith(1)
    })
  })
})
