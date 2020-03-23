import Detectors from '@src/detectors';
import StorageHandler, { StorageType } from './utils/storageHandler';
import EventHandler, { EventType } from './utils/eventHandler';

(() => {
  const storageHandler = new StorageHandler();
  const eventHandler = new EventHandler();
  const detectors = Detectors.map(Detector => new Detector(window));
  const detectBooks = () => {
    const exportableDetector = detectors.find(detector => detector.isExportable());
    const books = exportableDetector ? exportableDetector.extractBooks() : [];

    storageHandler.set(StorageType.Books, books);
  };

  // By manual event
  eventHandler.subscribe(EventType.DetectBooks, detectBooks);
})();
