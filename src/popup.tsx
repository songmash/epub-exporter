import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import 'typeface-roboto';

import Popup from '@src/components/Popup';

const container = document.querySelector('#popup');
ReactDOM.render(
  <>
    <CssBaseline />
    <Popup />
  </>,
  container,
);
