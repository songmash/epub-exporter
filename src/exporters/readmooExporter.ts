import BaseExporter from '@src/exporters/baseExporter';
import Book from '@src/types/book';

class ReadmooExporter extends BaseExporter {
  export(book: Book): Blob {
    console.log(this, book);

    return new Blob([JSON.stringify({ hello: 'world' }, null, 2)], { type: 'application/json' });
  }
}
export default ReadmooExporter;
