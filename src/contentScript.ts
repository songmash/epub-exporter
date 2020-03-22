import debounce from 'lodash/debounce';

import Detectors from '@src/detectors';
import StorageHandler, { StorageType } from './utils/storageHandler';

(() => {
  const storageHandler = new StorageHandler();
  const detectors = Detectors.map(Detector => new Detector(window));
  const mutationObserver = new MutationObserver(debounce(() => {
    const exportableDetector = detectors.find(detector => detector.isExportable());
    const books = exportableDetector ? exportableDetector.extractBooks() : [];

    storageHandler.set(StorageType.Books, books);
  }));

  // watch DOM change
  mutationObserver.observe(document, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
  });
})();
