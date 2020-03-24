import Exporter from '@src/types/exporter';
import Book from '@src/types/book';

abstract class BaseExporter implements Exporter {
  abstract export(book: Book): Blob;
}

export default BaseExporter;
