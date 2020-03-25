import Book from '@src/types/book';

export default interface Status {
  book: Book;
  message: string;
  itemsCountCompleted: number;
  itemsCount: number;
}
