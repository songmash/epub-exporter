import Book from '@src/types/book';
import StorageHandler, { StorageType } from '@src/utils/storageHandler';
import EventHandler, { EventType } from '@src/utils/eventHandler';
import mockChrome from '@test/mocks/mockChrome';

const isExportable = jest.fn();
const extractBooks = jest.fn();
const set = jest.spyOn(StorageHandler.prototype, 'set').mockImplementation();

// for test debounce function
jest.mock('lodash/debounce', () => jest.fn(fn => fn));

// mock @src/detectors
class MockDetector {
  public isExportable = isExportable;

  public extractBooks = extractBooks;
}
jest.setMock('@src/detectors', [MockDetector]);

// mock MutationObserver
type MutationObserver = typeof window.MutationObserver;
// eslint-disable-next-line func-names, prefer-arrow-callback
const MockMutationObserver = jest.fn(function (callback: Function) { callback(); });
MockMutationObserver.prototype = { observe: jest.fn() };
window.MutationObserver = MockMutationObserver as unknown as MutationObserver;

const loadContentScript = () => jest.isolateModules(() => {
  // eslint-disable-next-line global-require
  require('@src/contentScript');
});

describe('contentScript', () => {
  beforeEach(() => { window.chrome = mockChrome(); });
  afterEach(() => { delete window.chrome; });
  it('send Books to extension when any exportable detector found', () => {
    const books = [{ id: 'book double' }];
    isExportable.mockImplementationOnce(() => true);
    extractBooks.mockImplementationOnce(() => books);

    loadContentScript();

    expect(isExportable).toHaveBeenCalled();
    expect(extractBooks).toHaveBeenCalled();
    expect(set).toBeCalledWith(StorageType.Books, books);
  });

  it('send empty array to extension when no exportable detector found', () => {
    const books: Book[] = [];
    isExportable.mockImplementationOnce(() => false);
    extractBooks.mockImplementationOnce(() => books);

    loadContentScript();

    expect(isExportable).toHaveBeenCalled();
    expect(extractBooks).not.toHaveBeenCalled();
    expect(set).toBeCalledWith(StorageType.Books, books);
  });

  it('trigger by DetectBook event', () => {
    const books = [{ id: 'book double' }];
    const eventHandler = new EventHandler(window.chrome);
    isExportable.mockImplementation(() => true);
    extractBooks.mockImplementation(() => books);

    // first Detect
    loadContentScript();

    // second Detect
    eventHandler.sendToActiveTab(EventType.DetectBooks);

    expect(isExportable).toHaveBeenCalledTimes(2);
    expect(extractBooks).toHaveBeenCalledTimes(2);
    expect(set).toBeCalledTimes(2);
    expect(set).toBeCalledWith(StorageType.Books, books);
  });
});
