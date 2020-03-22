import StorageHandler, { StorageType } from '@src/utils/storageHandler';

const storageHandler = new StorageHandler();
const jsonPre = document.querySelector('pre.json');
const updateBooks = (books: unknown) => { jsonPre.innerHTML = JSON.stringify(books, null, '  '); };

storageHandler.get(StorageType.Books).then(updateBooks);
storageHandler.subscribe(StorageType.Books, (_, newBooks) => { updateBooks(newBooks); });
