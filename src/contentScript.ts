import debounce from 'lodash/debounce';

import Detectors from '@src/detectors';
import StorageHandler, { StorageType } from './utils/storageHandler';
import EventHandler, { EventType } from './utils/eventHandler';

(() => {
  const storageHandler = new StorageHandler();
  const eventHandler = new EventHandler();
  const detectors = Detectors.map(Detector => new Detector(window));
  const detectBooks = debounce(() => {
    const exportableDetector = detectors.find(detector => detector.isExportable());
    const books = exportableDetector ? exportableDetector.extractBooks() : [];

    storageHandler.set(StorageType.Books, books);
  }, 300);

  // By manuall event
  eventHandler.subscribe(EventType.DetectBooks, detectBooks);

  // By DOM change
  const mutationObserver = new MutationObserver(detectBooks);
  mutationObserver.observe(document, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
  });
})();
