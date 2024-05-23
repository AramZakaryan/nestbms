import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthorModule } from './author/author.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Author } from './author/entities/author.entity'
import { BookModule } from './book/book.module'
import { Book } from './book/entities/book.entity'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234567a@',
      database: 'bms',
      entities: [Author, Book],
      synchronize: true,
    }),
    AuthorModule,
    BookModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
