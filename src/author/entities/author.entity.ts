import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Book } from '../../book/entities/book.entity'

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @Column()
  biography: string
  @Column()
  date_of_birth: Date
  @OneToMany(() => Book, (book) => book.author, { onDelete: 'CASCADE' })
  book: Book[]
}
