import StorageHandler, { StorageType } from '@src/utils/storageHandler';
import mockChrome, { Chrome } from '@test/mocks/mockChrome';

let mockedChrome: Chrome;
const get = async (key: string) => new Promise(resolve => {
  mockedChrome.storage.local.get(key, resolve);
});
const set = (key: string, value: unknown) => new Promise(resolve => {
  mockedChrome.storage.local.set({ [key]: value }, resolve);
});

describe('StorageHandler', () => {
  beforeEach(() => { mockedChrome = mockChrome(); });
  describe('#set', () => {
    it('store value to storage', async () => {
      const books = [{ id: 'book double' }];
      const storageHandler = new StorageHandler(mockedChrome);
      const type = 'Books' as StorageType;

      await storageHandler.set(type, books);
      const result = await get(type);

      expect(result).toEqual(books);
    });
  });

  describe('#get', () => {
    it('get value from storage', async () => {
      const books = [{ id: 'book double' }, { id: 'book double 2' }, { id: 'book double 3' }];
      const storageHandler = new StorageHandler(mockedChrome);
      const type = 'Books' as StorageType;

      set(type, books);

      const result = await storageHandler.get(type);
      expect(result).toEqual(books);
    });

    it('get undefined when key not found', async () => {
      const storageHandler = new StorageHandler(mockedChrome);
      const type = 'not found' as StorageType;

      const result = await storageHandler.get(type);
      expect(result).toBeUndefined();
    });
  });

  describe('#subscribe', () => {
    it('trigger callback when subscribing target changed', () => {
      const callback = jest.fn();
      const storageHandler = new StorageHandler(mockedChrome);
      const type = 'Books' as StorageType;

      storageHandler.subscribe(type, callback);
      set(type, []);

      expect(callback).toBeCalledWith(undefined, []);
    });

    it('trigger callback when subscribing target changed', () => {
      const callback = jest.fn();
      const storageHandler = new StorageHandler(mockedChrome);
      const type = 'Books' as StorageType;
      const otherType = 'Other key' as StorageType;

      storageHandler.subscribe(type, callback);
      set(otherType, 'change value');

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
