import EventHandler, { EventType } from '@src/utils/eventHandler';
import Book from '@src/types/book';
import { exporterSelector } from '@src/exporters';
import StorageHandler, { StorageType } from '@src/utils/storageHandler';

const eventHandler = new EventHandler();
const storageHandler = new StorageHandler();

eventHandler.subscribe(EventType.DownloadBook, async (book: Book) => {
  try {
    const exporter = exporterSelector(book);
    const blob = await exporter.export();
    const objectUrl = URL.createObjectURL(blob);
    chrome.downloads.download({ url: objectUrl, filename: `${book.title}.epub` });
  } catch (e) {
    // @TODO: Error handler
    // eslint-disable-next-line no-console
    console.error(e);
  }

  await storageHandler.set(StorageType.Status, null);
});
