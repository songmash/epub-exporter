type Listener = (message: object) => void;

export type Chrome = typeof window.chrome;

interface Tab {
  id?: number;
}

const mockChrome = () => {
  const listeners: Listener[] = [];

  const mockRuntime = () => {
    const addListener = (listener: Listener) => listeners.push(listener);
    const sendMessage = (message: object) => listeners.forEach(listener => listener(message));
    const onMessage = { addListener };
    const runtime = { onMessage, sendMessage };

    return runtime;
  };

  const mockTabs = () => {
    const query = (queryInfo: object, callback: (result: Tab[]) => void) => {
      callback([{ id: 1 }]);
    };
    const sendMessage = (tabId: number, message: object) => {
      listeners.forEach(listener => listener(message));
    };
    const tabs = { query, sendMessage };

    return tabs;
  };

  type Items = { [key in string]?: unknown; };
  type Changes = { [key in string]?: { oldValue: unknown; newValue: unknown }; };
  const mockStorage = () => {
    const storageListeners: Listener[] = [];
    let storage: Items = {};
    const set = (items: Items, callback: Function) => {
      const changes: Changes = {};
      Object.keys(items).forEach(key => {
        const oldValue = storage[key];
        const newValue = items[key];

        changes[key] = { oldValue, newValue };
      });

      storage = { ...storage, ...items };
      storageListeners.forEach(storageListener => storageListener(changes));
      callback();
    };
    const get = (key: string, callback: (result: unknown) => void) => { callback(storage[key]); };
    const local = { get, set };
    const addListener = (listener: Listener) => storageListeners.push(listener);
    const onChanged = { addListener };

    return { local, onChanged };
  };

  return ({
    runtime: mockRuntime(),
    tabs: mockTabs(),
    storage: mockStorage(),
  }) as unknown as Chrome;
};

export default mockChrome;
