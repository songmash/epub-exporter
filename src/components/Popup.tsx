import React from 'react';

import style from '@src/stylesheets/popup.scss';

// import StorageHandler, { StorageType } from '@src/utils/storageHandler';

// const storageHandler = new StorageHandler();
// const updateBooks = (books: unknown) => {
// };
// storageHandler.get(StorageType.Books).then(updateBooks);
// storageHandler.subscribe(StorageType.Books, (_, newBooks) => { updateBooks(newBooks); });

const Popup = () => (
  <div className={style.popup}>
    <h1>Hello, world!</h1>
  </div>
);
export default Popup;
