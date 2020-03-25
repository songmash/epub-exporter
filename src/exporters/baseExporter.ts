import Exporter from '@src/types/exporter';
import Book from '@src/types/book';
import Status from '@src/types/status';
import StorageHandler, { StorageType } from '@src/utils/storageHandler';

abstract class BaseExporter implements Exporter {
  private status: Status;

  private storageHandler: StorageHandler;

  constructor(private book: Book) {
    this.status = {
      book,
      message: `開始下載： ${book.title}`,
      itemsCount: 0,
      itemsCountCompleted: 0,
    };
    this.storageHandler = new StorageHandler();
  }

  abstract export(): Blob;

  protected async updateStatus(partialStatus: Partial<Status>) {
    this.status = { ...this.status, ...partialStatus };

    await this.storageHandler.set(StorageType.Status, this.status);
  }
}

export default BaseExporter;
