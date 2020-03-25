import { exporterSelector } from '@src/exporters';
import Book, { Source } from '@src/types/book';
import BaseExporter from '@src/exporters/baseExporter';
import mockChrome from '@test/mocks/mockChrome';

window.chrome = mockChrome();

describe('exporterSelector', () => {
  it('return Exporter by source', () => {
    Object.values(Source).forEach(source => {
      const nullBook: Book = {
        id: '',
        title: '',
        coverImageUrl: '',
        source,
      };
      const exporter = exporterSelector(nullBook);

      expect(exporter).toBeInstanceOf(BaseExporter);
    });
  });

  it('throw Error with undefined source', () => {
    const invalidBook = {} as Book;
    expect(() => { exporterSelector(invalidBook); }).toThrow('Undefined Exporter');
  });
});
