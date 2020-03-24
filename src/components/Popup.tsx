import React, { Fragment, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';

import style from '@src/stylesheets/popup.scss';

import StorageHandler, { StorageType } from '@src/utils/storageHandler';
import EventHandler, { EventType } from '@src/utils/eventHandler';
import Book from '@src/types/book';

const storageHandler = new StorageHandler();
const eventHandler = new EventHandler();

const Popup = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loaded, setLoaded] = useState(false);
  const noBooks = books.length === 0;
  const downloadBook = (book: Book) => {
    eventHandler.sendToExtension(EventType.DownloadBook, book);
  };

  useEffect(() => {
    (async () => {
      // clear old books
      await storageHandler.set(StorageType.Books, null);

      // obtain books from page
      storageHandler.subscribe(StorageType.Books, (_, newBooks) => {
        setBooks(newBooks as Book[]);
        setLoaded(true);
      });

      // Timeout for 3 seconds
      setTimeout(() => setLoaded(true), 3000);

      eventHandler.sendToActiveTab(EventType.DetectBooks);
    })();
  }, []);

  if (!loaded) {
    return (
      <Box mx={16} my={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (noBooks) {
    return (
      <Typography variant="h6" noWrap>
        <Box textAlign="center" mx={2} my={1}>
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
              <Button variant="contained" color="primary" onClick={() => downloadBook(book)}>
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
