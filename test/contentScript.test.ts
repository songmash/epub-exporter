import { EventType } from '@src/utils/eventHandler';

const mockDetectors = (mockedIsExportable: Function, mockedExtractBooks: Function) => {
  class MockDetector {
    public isExportable = mockedIsExportable;

    public extractBooks = mockedExtractBooks;
  }
  jest.setMock('@src/detectors', [MockDetector]);
};
const mockEventHandler = (mockedSend: Function) => {
  jest.mock('@src/utils/eventHandler', () => {
    const oldEventHandler = jest.requireActual('@src/utils/eventHandler');

    return ({
      __esModule: true,
      ...oldEventHandler,
      default: jest.fn(() => ({ send: mockedSend })),
    });
  });
};

describe('contentScript', () => {
  const executeContentScript = () => {
    // eslint-disable-next-line global-require
    require('@src/contentScript');

    document.dispatchEvent(new Event('DOMNodeInserted'));
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('send Books to extension when any isExportable Detector found', () => {
    const books = [{ id: 'book double' }];
    const mockedIsExportable = jest.fn(() => true);
    const mockedExtractBooks = jest.fn(() => books);
    const mockedSend = jest.fn();
    mockDetectors(mockedIsExportable, mockedExtractBooks);
    mockEventHandler(mockedSend);

    executeContentScript();

    expect(mockedIsExportable).toHaveBeenCalled();
    expect(mockedExtractBooks).toHaveBeenCalled();
    expect(mockedSend).toBeCalledWith(EventType.SetBooks, { books });
  });

  test('send empty array to extension when no isExportable Detector found', () => {
    const mockedIsExportable = jest.fn(() => false);
    const mockedExtractBooks = jest.fn(() => []);
    const mockedSend = jest.fn();
    mockDetectors(mockedIsExportable, mockedExtractBooks);
    mockEventHandler(mockedSend);

    executeContentScript();

    expect(mockedIsExportable).toHaveBeenCalled();
    expect(mockedExtractBooks).not.toHaveBeenCalled();
    expect(mockedSend).toBeCalledWith(EventType.SetBooks, { books: [] });
  });
});
