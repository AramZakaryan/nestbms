import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { BookService } from './book.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { validate } from 'class-validator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto)
  }

  @Get()
  findAll() {
    return this.bookService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id)
  }
}
