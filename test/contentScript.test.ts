import EventHandler, { EventType } from '@src/utils/eventHandler';
import Book from '@src/types/book';

const isExportable = jest.fn();
const extractBooks = jest.fn();
const sendToExtension = jest.spyOn(EventHandler.prototype, 'sendToExtension').mockImplementation();

// for test debounce function
jest.useFakeTimers();

// mock @src/detectors
class MockDetector {
  public isExportable = isExportable;

  public extractBooks = extractBooks;
}
jest.setMock('@src/detectors', [MockDetector]);

// mock @src/utils/eventHandler
jest.mock('@src/utils/eventHandler', () => {
  const { default: RealEventHandler, ...components } = jest.requireActual('@src/utils/eventHandler');
  function MockedEventHandler() { }
  MockedEventHandler.prototype = RealEventHandler.prototype;

  return ({ __esModule: true, default: MockedEventHandler, ...components });
});

// mock MutationObserver
type MutationObserver = typeof window.MutationObserver;
// eslint-disable-next-line func-names, prefer-arrow-callback
const MockMutationObserver = jest.fn(function (callback: Function) { callback(); });
MockMutationObserver.prototype = { observe: jest.fn() };
window.MutationObserver = MockMutationObserver as unknown as MutationObserver;

const loadContentScript = () => jest.isolateModules(() => {
  // eslint-disable-next-line global-require
  require('@src/contentScript');
  jest.runAllTimers();
});

describe('contentScript', () => {
  it('send Books to extension when any exportable detector found', () => {
    const books = [{ id: 'book double' }];
    isExportable.mockImplementationOnce(() => true);
    extractBooks.mockImplementationOnce(() => books);

    loadContentScript();

    expect(isExportable).toHaveBeenCalled();
    expect(extractBooks).toHaveBeenCalled();
    expect(sendToExtension).toBeCalledWith(EventType.SetBooks, { books });
  });

  it('send empty array to extension when no exportable detector found', () => {
    const books: Book[] = [];
    isExportable.mockImplementationOnce(() => false);
    extractBooks.mockImplementationOnce(() => books);

    loadContentScript();

    expect(isExportable).toHaveBeenCalled();
    expect(extractBooks).not.toHaveBeenCalled();
    expect(sendToExtension).toBeCalledWith(EventType.SetBooks, { books });
  });
});
