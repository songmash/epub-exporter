import EventHandler, { EventType } from '@src/utils/eventHandler';
import Book from '@src/types/book';
import blobToDataUrl from '@src/utils/blobToDataUrl';
import { exporterSelector } from '@src/exporters';
import StorageHandler, { StorageType } from '@src/utils/storageHandler';

const eventHandler = new EventHandler();
const storageHandler = new StorageHandler();

eventHandler.subscribe(EventType.DownloadBook, async (book: Book) => {
  try {
    const exporter = exporterSelector(book);
    const blob = await exporter.export();
    const dataUrl = await blobToDataUrl(blob);
    chrome.downloads.download({ url: dataUrl, filename: `${book.title}.epub` });
  } catch (e) {
    // @TODO: Error handler
    // eslint-disable-next-line no-console
    console.error(e);
  }

  await storageHandler.set(StorageType.Status, null);
});
