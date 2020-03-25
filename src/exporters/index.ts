import Book, { Source } from '@src/types/book';
import ReadmooExporter from '@src/exporters/readmooExporter';

export const exporterSelector = (book: Book) => {
  switch (book.source) {
  case Source.Readmoo:
    return new ReadmooExporter(book);
  default:
    throw new Error('Undefined Exporter');
  }
};

export default [
  ReadmooExporter,
];
