type Listener = (message: object) => void;

type Chrome = typeof window.chrome;

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

  return ({
    runtime: mockRuntime(),
    tabs: mockTabs(),
  }) as unknown as Chrome;
};

export default mockChrome;
