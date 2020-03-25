import JSZip from 'jszip';
import Exporter from '@src/types/exporter';
import Book from '@src/types/book';
import Status from '@src/types/status';
import StorageHandler, { StorageType } from '@src/utils/storageHandler';

abstract class BaseExporter implements Exporter {
  private status: Status;

  private storageHandler: StorageHandler;

  protected files: { [key in string]: string|Blob|ArrayBuffer } = {};

  constructor(protected book: Book) {
    this.status = {
      book,
      message: `開始下載： ${book.title}`,
      itemsCount: 0,
      itemsCountCompleted: 0,
    };

    this.storageHandler = new StorageHandler();
  }

  abstract export(): Promise<Blob>;

  protected async updateStatus(updateFn: (oldStatus: Status) => Partial<Status>) {
    this.status = { ...this.status, ...updateFn(this.status) };

    await this.storageHandler.set(StorageType.Status, this.status);
  }

  protected buildEPUB(): Promise<Blob> {
    const zip = new JSZip();

    zip.file('mimetype', 'application/epub+zip');
    Object.entries(this.files).forEach(([path, data]) => { zip.file(path, data); });

    return zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
  }
}

export default BaseExporter;
