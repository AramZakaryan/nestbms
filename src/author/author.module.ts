import { Global, Module } from '@nestjs/common'
import { AuthorService } from './author.service'
import { AuthorController } from './author.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Author } from './entities/author.entity'
// @Global()
@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
