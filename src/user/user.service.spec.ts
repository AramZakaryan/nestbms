import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserService } from './user.service'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { BadRequestException } from '@nestjs/common'

describe('UserService', () => {
  let service: UserService
  let userRepository: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password' }
      const hashedPassword = 'hashedPassword'
      const savedUser = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
      }

      jest.spyOn(argon2, 'hash').mockResolvedValue(hashedPassword)
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null)
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser)

      const result = await service.create(createUserDto)

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      })
      expect(argon2.hash).toHaveBeenCalledWith(createUserDto.password)
      expect(userRepository.save).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: hashedPassword,
      })
      expect(result).toEqual({ user: savedUser })
    })

    it('should throw a BadRequestException if the user already exists', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password' }
      const existingUser = {
        id: 1,
        email: createUserDto.email,
        password: 'hashedPassword',
      }

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser)

      await expect(service.create(createUserDto)).rejects.toThrowError(
        BadRequestException,
      )
    })
  })

  describe('findOne', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com'
      const user = { id: 1, email, password: 'hashedPassword' }

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user)

      const result = await service.findOne(email)

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email })
      expect(result).toEqual(user)
    })
  })
})
