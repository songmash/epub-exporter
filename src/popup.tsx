import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import 'typeface-roboto';

import Popup from '@src/components/Popup';
import EventHandler, { EventType } from '@src/utils/eventHandler';

// Detect books onload
const eventHandler = new EventHandler();
eventHandler.sendToActiveTab(EventType.DetectBooks);

const container = document.querySelector('#popup');
ReactDOM.render(
  <>
    <CssBaseline />
    <Popup />
  </>,
  container,
);
