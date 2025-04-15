import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Word } from '../word/word.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 255, unique: true, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'blob', nullable: true })
  img?: Buffer;

  @OneToMany(() => Word, (word) => word.category)
  words: Word[];
}
