import EventHandler, { EventType } from '@src/utils/eventHandler';
import Book from '@src/types/book';

const eventHandler = new EventHandler();
eventHandler.subscribe(EventType.DownloadBook, (book: Book) => {
  // eslint-disable-next-line no-console
  console.log(book);
  const url = `data:application/epub+zip;base64,${btoa('Hello, world')}`;
  chrome.downloads.download({ url, filename: `${book.title}.epub` });
});
