export enum StorageType {
  Books = 'Books',
}

type Callback = (oldValue: unknown, newValue: unknown) => void;

type Listener = {
  type: StorageType;
  callback: Callback;
};

export default class StorageHandler {
  private listeners: Listener[] = [];

  constructor(private chrome = window.chrome) {
    this.bindListeners();
  }

  set(type: StorageType, value: unknown): Promise<void> {
    return new Promise(resolve => this.chrome.storage.local.set({ [type]: value }, resolve));
  }

  get(type: StorageType): Promise<unknown> {
    return new Promise(resolve => this.chrome.storage.local.get(type, resolve));
  }

  subscribe(type: StorageType, callback: Callback) {
    this.listeners.push({ type, callback });
  }

  private bindListeners() {
    this.chrome.storage.onChanged.addListener(changes => {
      Object.keys(changes).forEach(type => {
        const { oldValue, newValue } = changes[type];

        this.listeners.forEach(listener => {
          if (listener.type === type) {
            listener.callback(oldValue, newValue);
          }
        });
      });
    });
  }
}
