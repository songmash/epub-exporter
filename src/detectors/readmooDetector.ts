import $ from 'jquery';

import Detector from '@src/types/detector';
import Book from '@src/types/book';

const libraryHostname = 'read.readmoo.com';

export default class ReadmooDetector implements Detector {
  private window: Window;

  constructor(window: Window) {
    this.window = window;
  }

  isExportable(): boolean {
    const { location } = this.window;
    const { hostname } = location;

    return hostname === libraryHostname;
  }

  extractBooks(): Book[] {
    const { document } = this.window;
    const $items = $(document).find('.library-item');
    const books: Book[] = [];

    $items.each((_, elem) => {
      const $item = $(elem);
      const $bookLink = $item.find('.cover-container > .cover > a');
      const id = $bookLink.attr('href').split('/').pop();
      const title = $item.find('.info > .title').text();
      const coverImageUrl = $bookLink.find('.cover-img').attr('src');

      books.push({ id, title, coverImageUrl });
    });

    return books;
  }
}
