import styles from '@src/popup.scss';
import EventHandler, { EventType } from './utils/eventHandler';

// eslint-disable-next-line no-console
console.log(styles);
const title = document.querySelector('h1');
title.innerText = 'JS red title';

const eventHandler = new EventHandler();
eventHandler.subscribe(EventType.SetBooks, data => {
  title.innerText = JSON.stringify(data);
});
