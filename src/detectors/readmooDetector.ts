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
    const libraryItems = document.querySelectorAll('.library-item');
    const books: Book[] = [];

    libraryItems.forEach(libraryItem => {
      const bookLink = libraryItem.querySelector('.cover-container > .cover > a');
      const id = bookLink.getAttribute('href').split('/').pop();
      const title = libraryItem.querySelector('.info > .title').textContent;
      const coverImageUrl = bookLink.querySelector('.cover-img').getAttribute('src');

      books.push({ id, title, coverImageUrl });
    });

    return books;
  }
}
