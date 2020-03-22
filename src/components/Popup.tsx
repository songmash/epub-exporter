import React from 'react';

import style from '@src/stylesheets/popup.scss';

import Box from '@material-ui/core/Box';

// import StorageHandler, { StorageType } from '@src/utils/storageHandler';

// const storageHandler = new StorageHandler();
// const updateBooks = (books: unknown) => {
// };
// storageHandler.get(StorageType.Books).then(updateBooks);
// storageHandler.subscribe(StorageType.Books, (_, newBooks) => { updateBooks(newBooks); });

const Popup = () => (
  <Box className={style.popup} color="white" bgcolor="palevioletred">
    Hello, world!
  </Box>
);
export default Popup;
