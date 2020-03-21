import EventHandler, { EventType } from '@src/utils/eventHandler';
import mockChrome from './mocks/mockChrome';

type Chrome = typeof chrome;

const isExportable = jest.fn(() => true);
const extractBooks = jest.fn();
class MockDetector {
  public isExportable = isExportable;

  public extractBooks = extractBooks;
}
jest.setMock('@src/detectors', [MockDetector]);

const mockedChrome = mockChrome();

const loadContentScript = () => {
  // eslint-disable-next-line global-require
  require('@src/contentScript');
};

const detectBooks = () => {
  const eventHandler = new EventHandler(mockedChrome);
  eventHandler.sendToActiveTab(EventType.DetectBooks);
};

jest.spyOn(EventHandler.prototype, 'sendToExtension');

const oldChrome = window.chrome;

describe('contentScript', () => {
  beforeEach(() => { window.chrome = mockedChrome; });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    window.chrome = oldChrome;
  });

  test('send Books to extension when any isExportable Detector found', () => {
    const books = [{ id: 'book double' }];
    isExportable.mockImplementationOnce(() => true);
    extractBooks.mockImplementationOnce(() => books);

    loadContentScript();
    detectBooks();

    expect(isExportable).toHaveBeenCalled();
    expect(extractBooks).toHaveBeenCalled();
    expect(EventHandler.prototype.sendToExtension).toBeCalledWith(EventType.SetBooks, { books });
  });

  test('send empty array to extension when no isExportable Detector found', () => {
    isExportable.mockImplementationOnce(() => false);
    extractBooks.mockImplementationOnce(() => []);

    loadContentScript();
    detectBooks();

    expect(isExportable).toHaveBeenCalled();
    expect(extractBooks).toHaveBeenCalled();
    expect(
      EventHandler.prototype.sendToExtension,
    ).toBeCalledWith(EventType.SetBooks, { books: [] });
  });
});
