import {
  Column,
  Entity,
  getRepository,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Author } from '../../author/entities/author.entity'
import { ValidateIf, ValidateNested } from 'class-validator'
import { getRepositoryToken } from '@nestjs/typeorm'

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title: string
  @Column()
  isbn: string
  @Column()
  author_id: number
  @ManyToOne(() => Author, (author) => author.book, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: Author
}
