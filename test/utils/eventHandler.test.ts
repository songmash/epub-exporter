import EventHandler, { EventType } from '@src/utils/eventHandler';
import mockChrome from '@test/mocks/mockChrome';

describe('EventHandler', () => {
  describe('#sendToExtension', () => {
    it('sent message to a event type', () => {
      const mockedChrome = mockChrome();
      const eventHandler = new EventHandler(mockedChrome);
      const listener = jest.fn();
      const data = { books: [{ id: 'book double' }] };
      const type = 'DetectBooks' as EventType;

      mockedChrome.runtime.onMessage.addListener(listener);
      eventHandler.sendToExtension(type, data);

      expect(listener).toBeCalledWith({ type, data });
    });
  });

  describe('#sendToActiveTab', () => {
    it('sent message to a event type', () => {
      const mockedChrome = mockChrome();
      const eventHandler = new EventHandler(mockedChrome);
      const listener = jest.fn();
      const data = { books: [{ id: 'book double' }] };
      const type = 'DetectBooks' as EventType;

      mockedChrome.runtime.onMessage.addListener(listener);
      eventHandler.sendToActiveTab(type, data);

      expect(listener).toBeCalledWith({ type, data });
    });
  });

  describe('#subscribe', () => {
    it('subscribe a event type', () => {
      const mockedChrome = mockChrome();
      const eventHandler = new EventHandler(mockedChrome);
      const callback = jest.fn();
      const data = { books: [{ id: 'book double' }] };
      const type = 'DetectBooks' as EventType;

      eventHandler.subscribe(type, callback);

      mockedChrome.runtime.sendMessage({ type, data });
      expect(callback).toBeCalledWith(data);

      mockedChrome.runtime.sendMessage({ type: 'invalid', data: 'invalid' });
      expect(callback).not.toBeCalledWith('invalid');
    });
  });
});
