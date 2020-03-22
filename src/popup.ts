import EventHandler, { EventType } from './utils/eventHandler';

const eventHandler = new EventHandler();
const jsonPre = document.querySelector('pre.json');

eventHandler.subscribe(EventType.SetBooks, data => {
  jsonPre.innerHTML = JSON.stringify(data, null, '  ');
});
