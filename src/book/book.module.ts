import { Module } from '@nestjs/common'
import { BookService } from './book.service'
import { BookController } from './book.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Book } from './entities/book.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'
import { AuthorService } from '../author/author.service'
import { AuthorModule } from '../author/author.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
    }),
    AuthorModule,
  ],
  controllers: [BookController],
  providers: [BookService, JwtStrategy],
})
export class BookModule {}
