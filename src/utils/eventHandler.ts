export enum EventType {
  SetBooks = 'SetBooks',
}

export type Runtime = typeof chrome.runtime;

type Callback = (data?: object) => void;

interface Message {
  type: EventType;
  data?: object;
}

interface Listeners {
  type: EventType;
  callback: Callback;
}

export default class EventHandler {
  private listeners: Listeners[] = [];

  constructor(private runtime = chrome.runtime) {
    this.bindListeners();
  }

  send(type: EventType, data?: object) {
    this.runtime.sendMessage({ type, data });
  }

  subscribe(type: EventType, callback: Callback) {
    this.listeners.push({ type, callback });
  }

  private bindListeners() {
    this.runtime.onMessage.addListener((message: Message) => {
      const { type, data } = message;

      this.listeners.forEach(listener => {
        if (listener.type === type) {
          listener.callback(data);
        }
      });
    });
  }
}
