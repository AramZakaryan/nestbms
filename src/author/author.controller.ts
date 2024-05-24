import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common'
import { AuthorService } from './author.service'
import { CreateAuthorDto } from './dto/create-author.dto'
import { UpdateAuthorDto } from './dto/update-author.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto)
  }

  @Get()
  findAll() {
    return this.authorService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(+id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(+id, updateAuthorDto)
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorService.remove(+id)
  }
}
