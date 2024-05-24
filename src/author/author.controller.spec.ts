import { Test, TestingModule } from '@nestjs/testing'
import { AuthorController } from './author.controller'
import { AuthorService } from './author.service'
import { CreateAuthorDto } from './dto/create-author.dto'
import { Author } from './entities/author.entity'
import { DeleteResult, UpdateResult } from 'typeorm'

describe('AuthorController', () => {
  let controller: AuthorController
  let service: AuthorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: AuthorService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthorController>(AuthorController)
    service = module.get<AuthorService>(AuthorService)
  })

  /**
   * This test suite checks the functionality of the AuthorController.
   * It includes tests for the following methods:
   * - create: Verifies that a new author is created successfully.
   * - findAll: Verifies that all authors are retrieved.
   * - findOne: Verifies that a single author is retrieved by ID.
   * - update: Verifies that an existing author is updated successfully.
   * - remove: Verifies that an existing author is deleted successfully.
   */
  describe('AuthorController', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined()
    })

    it('should create a new author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'John Doe',
        biography: 'John Doe is a famous author.',
        date_of_birth: new Date('1980-01-01'),
      }

      const author: Author = {
        id: 1,
        name: 'John Doe',
        biography: 'John Doe is a famous author.',
        date_of_birth: new Date('1980-01-01'),
        book: [],
      }

      jest.spyOn(service, 'create').mockResolvedValue(author)

      expect(await controller.create(createAuthorDto)).toEqual(author)
      expect(service.create).toHaveBeenCalledWith(createAuthorDto)
    })

    it('should find all authors', async () => {
      const authors: Author[] = [
        {
          id: 1,
          name: 'John Doe',
          biography: 'John Doe is a famous author.',
          date_of_birth: new Date('1980-01-01'),
          book: [],
        },
        {
          id: 2,
          name: 'Jane Doe',
          biography: 'Jane Doe is also a famous author.',
          date_of_birth: new Date('1985-05-15'),
          book: [],
        },
      ]

      jest.spyOn(service, 'findAll').mockResolvedValue(authors)

      expect(await controller.findAll()).toEqual(authors)
      expect(service.findAll).toHaveBeenCalled()
    })

    it('should find one author', async () => {
      const author: Author = {
        id: 1,
        name: 'John Doe',
        biography: 'John Doe is a famous author.',
        date_of_birth: new Date('1980-01-01'),
        book: [],
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(author)

      expect(await controller.findOne('1')).toEqual(author)
      expect(service.findOne).toHaveBeenCalledWith(1)
    })

    it('should update an author', async () => {
      const updateAuthorDto: Partial<CreateAuthorDto> = {
        name: 'John Doe Updated',
        biography: 'John Doe is an updated famous author.',
      }

      const author: Author = {
        id: 1,
        name: 'John Doe Updated',
        biography: 'John Doe is an updated famous author.',
        date_of_birth: new Date('1980-01-01'),
        book: [],
      }

      jest
        .spyOn(service, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult)

      expect(await controller.update('1', updateAuthorDto)).toEqual({
        affected: 1,
      })
      expect(service.update).toHaveBeenCalledWith(1, updateAuthorDto)
    })

    it('should remove an author', async () => {
      jest
        .spyOn(service, 'remove')
        .mockResolvedValue({ affected: 1 } as DeleteResult)

      expect(await controller.remove('1')).toEqual({
        affected: 1,
      } as DeleteResult)
      expect(service.remove).toHaveBeenCalledWith(1)
    })
  })
})
