import React, { useState, useEffect, Fragment } from 'react';
import {
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Box, Divider, Typography,
} from '@material-ui/core';

import style from '@src/stylesheets/popup.scss';

import StorageHandler, { StorageType } from '@src/utils/storageHandler';
import Book from '@src/types/book';

const storageHandler = new StorageHandler();

const Popup = () => {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    storageHandler.get(StorageType.Books).then(setBooks);

    storageHandler.subscribe(StorageType.Books, (_, newBooks) => { setBooks(newBooks as Book[]); });
  }, []);
  const noBooks = books.length === 0;

  if (noBooks) {
    return (
      <Typography variant="h6" noWrap>
        <Box textAlign="center" mx={2} m={1}>
          沒有可供下載書籍
        </Box>
      </Typography>
    );
  }

  return (
    <Box className={style.popup}>
      <List>
        { books.map(book => (
          <Fragment key={book.id}>
            <ListItem>
              <ListItemAvatar>
                <Avatar variant="square" alt={book.title} src={book.coverImageUrl} />
              </ListItemAvatar>
              <ListItemText primary={book.title} />
              <Button variant="contained" color="primary">
                下載
              </Button>
            </ListItem>
            <Divider variant="inset" component="li" />
          </Fragment>
        )) }
      </List>
    </Box>
  );
};
export default Popup;
