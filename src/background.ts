import EventHandler, { EventType } from '@src/utils/eventHandler';
import Book from '@src/types/book';
import blobToDataUrl from '@src/utils/blobToDataUrl';

const eventHandler = new EventHandler();
eventHandler.subscribe(EventType.DownloadBook, async (book: Book) => {
  // eslint-disable-next-line no-console
  const blob = new Blob([JSON.stringify(book, null, 2)], { type: 'application/json' });
  const dataUrl = await blobToDataUrl(blob);

  chrome.downloads.download({ url: dataUrl, filename: `${book.title}.epub` });
});
