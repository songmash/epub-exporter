import EventHandler, { EventType } from './utils/eventHandler';

const eventHandler = new EventHandler();
const jsonPre = document.querySelector('pre.json');

window.addEventListener('load', () => {
  eventHandler.sendToActiveTab(EventType.DetectBooks);
});

eventHandler.subscribe(EventType.SetBooks, data => {
  jsonPre.innerHTML = JSON.stringify(data, null, '  ');
});
