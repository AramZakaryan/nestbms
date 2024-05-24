import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'

describe('UserController', () => {
  let controller: UserController
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<UserController>(UserController)
    userService = module.get<UserService>(UserService)
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      }
      const savedUser: User = {
        id: 1,
        email: createUserDto.email,
        password: 'hashedPassword',
      }

      jest.spyOn(userService, 'create').mockResolvedValue({ user: savedUser })

      const result = await controller.create(createUserDto)

      expect(userService.create).toHaveBeenCalledWith(createUserDto)
      expect(result).toEqual({ user: savedUser })
    })
  })
})
