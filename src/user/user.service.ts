import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import * as argon2 from 'argon2'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    // Check if a user with the same email already exists
    const existUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    })
    if (existUser) throw new BadRequestException('user exists')
    const user = await this.userRepository
      .save({
        email: createUserDto.email,
        password: await argon2.hash(createUserDto.password),
      })
      .catch((err) => new BadRequestException(err))
    return { user }
  }

  async findOne(email: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ email })
  }
}
