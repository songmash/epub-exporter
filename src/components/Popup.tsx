import React, { Fragment, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Typography,
} from '@material-ui/core';

import style from '@src/stylesheets/popup.scss';

import StorageHandler, { StorageType } from '@src/utils/storageHandler';
import EventHandler, { EventType } from '@src/utils/eventHandler';
import Book from '@src/types/book';
import Status from '@src/types/status';

const storageHandler = new StorageHandler();
const eventHandler = new EventHandler();

const StatusRow = (props: { status?: Status }) => {
  const { status } = props;
  if (!status) {
    return null;
  }
  const {
    book,
    message,
    itemsCount,
    itemsCountCompleted,
  } = status;
  const completed = itemsCount > 0 ? Math.round((itemsCountCompleted / itemsCount) * 100.0) : 0;

  return (
    <>
      <Box display="flex" py={1} mb={1} px={2} alignItems="center">
        <Box mr={2}>
          <Avatar variant="square" alt={book.title} src={book.coverImageUrl} />
        </Box>
        <Box width="100%">
          <Typography variant="subtitle1">
            {book.title}
          </Typography>
          <Typography variant="caption">
            {message}
          </Typography>
          <LinearProgress variant="determinate" value={completed} />
        </Box>
      </Box>
      <Divider variant="middle" />
    </>
  );
};

const Popup = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<Status|undefined>(undefined);
  const downloadBook = (book: Book) => {
    eventHandler.sendToExtension(EventType.DownloadBook, book);
  };

  useEffect(() => {
    (async () => {
      // clear old books
      await storageHandler.set(StorageType.Books, null);
      const initStatus = await storageHandler.get(StorageType.Status) as Status;
      setStatus(initStatus);

      // obtain books from page
      storageHandler.subscribe(StorageType.Books, (_, newBooks) => {
        setBooks(newBooks as Book[]);
      });

      // obtain status
      storageHandler.subscribe(StorageType.Status, (_, newStatus) => {
        setStatus(newStatus as Status);
      });

      eventHandler.sendToActiveTab(EventType.DetectBooks);
    })();
  }, []);

  return (
    <Box className={style.popup}>
      <StatusRow status={status} />
      <List>
        { (books.length > 0) ? books.map(book => (
          <Fragment key={book.id}>
            <ListItem>
              <ListItemAvatar>
                <Avatar variant="square" alt={book.title} src={book.coverImageUrl} />
              </ListItemAvatar>
              <ListItemText primary={book.title} />
              <Button disabled={!!status} variant="contained" color="primary" onClick={() => downloadBook(book)}>
                下載
              </Button>
            </ListItem>
            <Divider variant="inset" component="li" />
          </Fragment>
        )) : (
          <ListItem>
            沒有可下載的書籍
          </ListItem>
        ) }
      </List>
    </Box>
  );
};
export default Popup;
