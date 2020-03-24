import Book from '@src/types/book';

export default interface Exporter {
  export: (book: Book) => Blob;
}
