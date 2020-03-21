import Detectors from '@src/detectors';
import EventHandler, { EventType } from '@src/utils/eventHandler';

(() => {
  const eventHandler = new EventHandler();
  const detectors = Detectors.map(Detector => new Detector(window));

  eventHandler.subscribe(EventType.DetectBooks, () => {
    const exportableDetector = detectors.find(detector => detector.isExportable());
    const books = exportableDetector ? exportableDetector.extractBooks() : [];

    eventHandler.sendToExtension(EventType.SetBooks, { books });
  });
})();
