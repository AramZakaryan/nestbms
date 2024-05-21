import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
}
