import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { Book } from './entities/book.entity'
import { BookService } from './book.service'
import { AuthorService } from '../author/author.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { BadRequestException } from '@nestjs/common'
import { Author } from '../author/entities/author.entity'

describe('BookService', () => {
  let service: BookService
  let bookRepository: Repository<Book>
  let authorService: AuthorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: AuthorService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<BookService>(BookService)
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book))
    authorService = module.get<AuthorService>(AuthorService)
  })

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        author_id: 1,
      }

      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValue(null)
      jest.spyOn(authorService, 'findOne').mockResolvedValue({
        id: 1,
        name: 'John Doe',
        biography: 'biology 2',
        date_of_birth: new Date('2021-02-23 13:11:07'),
        book: [], // not specified here
      })
      // "biography": "biology 2",
      //   "date_of_birth": "1880-08-06T21:02:00.000Z"
      jest.spyOn(bookRepository, 'save').mockResolvedValue({
        id: 1,
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        author_id: 1,
        author: undefined, // not specified here
      })

      const result = await service.create(createBookDto)
      expect(bookRepository.findOneBy).toHaveBeenCalledWith({
        title: 'Test Book',
      })
      expect(authorService.findOne).toHaveBeenCalledWith(1)
      expect(bookRepository.save).toHaveBeenCalledWith({
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        author_id: 1,
      })
      expect(result).toEqual({
        id: 1,
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        author_id: 1,
      })
    })

    it('should throw a BadRequestException if the book already exists', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        author_id: 1,
      }

      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValue({
        id: 1,
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        author_id: 1,
        author: undefined, // not specified here
      })

      await expect(service.create(createBookDto)).rejects.toThrowError(
        BadRequestException,
      )
    })

    it('should throw a BadRequestException if the author does not exist', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        author_id: 1,
      }

      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValue(null)
      jest.spyOn(authorService, 'findOne').mockResolvedValue(null)

      await expect(service.create(createBookDto)).rejects.toThrowError(
        BadRequestException,
      )
    })
  })

  describe('findAll', () => {
    it('should return all books with their authors', async () => {
      const books = [
        {
          id: 1,
          title: 'Test Book 1',
          isbn: '978-3-16-148410-0',
          author_id: 1,
          author: {
            id: 1,
            name: 'John Doe',
            biography: 'biology 1',
            date_of_birth: new Date('1980-08-06T20:00:00.000Z'),
            book: [], // not specified here
          },
        },
        {
          id: 2,
          title: 'Test Book 2',
          isbn: '978-3-16-148410-1',
          author_id: 2,
          author: {
            id: 2,
            name: 'Jane Doe',
            biography: 'biology 2',
            date_of_birth: new Date('1970-08-06T20:00:00.000Z'),
            book: [], // not specified here
          },
        },
      ]

      jest.spyOn(bookRepository, 'find').mockResolvedValue(books)

      const result = await service.findAll()
      expect(bookRepository.find).toHaveBeenCalledWith({
        relations: { author: true },
      })
      expect(result).toEqual(books)
    })
  })

  describe('findOne', () => {
    it('should return a book by its id', async () => {
      const book = {
        id: 1,
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        author_id: 1,
        author: undefined, // not specified here
      }

      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValue(book)

      const result = await service.findOne(1)
      expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(result).toEqual(book)
    })
  })

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        isbn: '978-3-16-148410-1',
        author_id: 2,
      }

      const existingBook = {
        id: 1,
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        author_id: 1,
        author: undefined, // not specified here
      }

      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValue(existingBook)
      jest
        .spyOn(bookRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult)

      const result = await service.update(1, updateBookDto)
      expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(bookRepository.update).toHaveBeenCalledWith(1, {
        title: 'Updated Book',
        isbn: '978-3-16-148410-1',
        author_id: 2,
      })
      expect(result).toEqual({ affected: 1 })
    })

    it('should throw a BadRequestException if the book does not exist', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        isbn: '978-3-16-148410-1',
        author_id: 2,
      }

      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValue(null)

      await expect(service.update(1, updateBookDto)).rejects.toThrowError(
        BadRequestException,
      )
    })
  })

  describe('remove', () => {
    it('should delete a book', async () => {
      jest
        .spyOn(bookRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as DeleteResult)

      const result = await service.remove(1)
      expect(bookRepository.delete).toHaveBeenCalledWith(1)
      expect(result).toEqual({ affected: 1 })
    })
  })
})
