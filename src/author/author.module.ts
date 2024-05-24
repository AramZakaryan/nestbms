import { Global, Module } from '@nestjs/common'
import { AuthorService } from './author.service'
import { AuthorController } from './author.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Author } from './entities/author.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'
import { BookModule } from '../book/book.module'

// @Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Author]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
    }),
  ],
  controllers: [AuthorController],
  providers: [AuthorService, JwtStrategy],
  exports: [AuthorService],
})
export class AuthorModule {}
