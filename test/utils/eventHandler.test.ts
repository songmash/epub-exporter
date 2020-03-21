import EventHandler, { EventType } from '@src/utils/eventHandler';
import mockChrome from '@test/mocks/mockChrome';

describe('EventHandler', () => {
  describe('#sendToExtension', () => {
    it('sent message to a event type', () => {
      const mockedChrome = mockChrome();
      const eventHandler = new EventHandler(mockedChrome);
      const listener = jest.fn();
      const data = { books: [{ id: 'book double' }] };

      mockedChrome.runtime.onMessage.addListener(listener);
      eventHandler.sendToExtension(EventType.SetBooks, data);

      expect(listener).toBeCalledWith({ type: EventType.SetBooks, data });
    });
  });

  describe('#sendToActiveTab', () => {
    it('sent message to a event type', () => {
      const mockedChrome = mockChrome();
      const eventHandler = new EventHandler(mockedChrome);
      const listener = jest.fn();
      const data = { books: [{ id: 'book double' }] };

      mockedChrome.runtime.onMessage.addListener(listener);
      eventHandler.sendToActiveTab(EventType.SetBooks, data);

      expect(listener).toBeCalledWith({ type: EventType.SetBooks, data });
    });
  });

  describe('#subscribe', () => {
    it('subscribe a event type', () => {
      const mockedChrome = mockChrome();
      const eventHandler = new EventHandler(mockedChrome);
      const callback = jest.fn();
      const data = { books: [{ id: 'book double' }] };

      eventHandler.subscribe(EventType.SetBooks, callback);

      mockedChrome.runtime.sendMessage({ type: EventType.SetBooks, data });
      expect(callback).toBeCalledWith(data);

      mockedChrome.runtime.sendMessage({ type: 'invalid', data: 'invalid' });
      expect(callback).not.toBeCalledWith('invalid');
    });
  });
});
