import Book from '@src/types/book';
import StorageHandler, { StorageType } from '@src/utils/storageHandler';
import EventHandler, { EventType } from '@src/utils/eventHandler';
import mockChrome from '@test/mocks/mockChrome';

const isExportable = jest.fn();
const extractBooks = jest.fn();
const set = jest.spyOn(StorageHandler.prototype, 'set').mockImplementation();

// mock @src/detectors
class MockDetector {
  public isExportable = isExportable;

  public extractBooks = extractBooks;
}
jest.setMock('@src/detectors', [MockDetector]);

const loadContentScript = () => jest.isolateModules(() => {
  // eslint-disable-next-line global-require
  require('@src/contentScript');
});

describe('contentScript', () => {
  beforeEach(() => { window.chrome = mockChrome(); });
  afterEach(() => { delete window.chrome; });

  it('send Books to extension when any exportable detector found', () => {
    const eventHandler = new EventHandler(window.chrome);
    const books = [{ id: 'book double' }];
    isExportable.mockImplementationOnce(() => true);
    extractBooks.mockImplementationOnce(() => books);

    loadContentScript();
    eventHandler.sendToActiveTab(EventType.DetectBooks);

    expect(isExportable).toHaveBeenCalled();
    expect(extractBooks).toHaveBeenCalled();
    expect(set).toBeCalledWith(StorageType.Books, books);
  });

  it('send empty array to extension when no exportable detector found', () => {
    const eventHandler = new EventHandler(window.chrome);
    const books: Book[] = [];
    isExportable.mockImplementationOnce(() => false);
    extractBooks.mockImplementationOnce(() => books);

    loadContentScript();
    eventHandler.sendToActiveTab(EventType.DetectBooks);

    expect(isExportable).toHaveBeenCalled();
    expect(extractBooks).not.toHaveBeenCalled();
    expect(set).toBeCalledWith(StorageType.Books, books);
  });
});
