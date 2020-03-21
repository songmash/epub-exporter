import EventHandler, { EventType, Runtime } from '@src/utils/eventHandler';

type ExtendedGlobal = { chrome: object };
type Listener = (message: object) => void;
const extendedGlobal = global as unknown as ExtendedGlobal;
const mockRuntime = () => {
  const listeners: Listener[] = [];
  const addListener = (listener: Listener) => listeners.push(listener);
  const sendMessage = (message: object) => listeners.forEach(listener => listener(message));
  const onMessage = { addListener };
  const runtime = { onMessage, sendMessage };

  extendedGlobal.chrome = { runtime };

  return runtime;
};

describe('EventHandler', () => {
  afterAll(() => delete extendedGlobal.chrome);

  describe('#send', () => {
    it('sent message to a event type', () => {
      const runtime = mockRuntime();
      const eventHandler = new EventHandler(runtime as unknown as Runtime);
      const listener = jest.fn();
      const data = { books: [{ id: 'book double' }] };

      // listen event
      runtime.onMessage.addListener(listener);

      // send a event with data
      eventHandler.send(EventType.SetBooks, data);

      expect(listener).toBeCalledWith({ type: EventType.SetBooks, data });
    });
  });

  describe('#subscribe', () => {
    it('subscribe a event type', () => {
      const runtime = mockRuntime();
      const eventHandler = new EventHandler(runtime as unknown as Runtime);
      const callback = jest.fn();
      const data = { books: [{ id: 'book double' }] };

      // subscribe a event
      eventHandler.subscribe(EventType.SetBooks, callback);

      // call event maually with `EventType.SetBooks` type and data
      runtime.sendMessage({ type: EventType.SetBooks, data });
      expect(callback).toBeCalledWith(data);

      // call event maually with `invalid` type and invalid data
      runtime.sendMessage({ type: 'invalid', data: 'invalid' });
      expect(callback).not.toBeCalledWith('invalid');
    });
  });
});
