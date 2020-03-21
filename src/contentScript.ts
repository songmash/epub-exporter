import Detectors from '@src/detectors';
import EventHandler, { EventType } from '@src/utils/eventHandler';

(() => {
  const eventHandler = new EventHandler();
  const detectors = Detectors.map(Detector => new Detector(window));

  document.addEventListener('DOMNodeInserted', () => {
    const exportableDetector = detectors.find(detector => detector.isExportable());

    if (exportableDetector) {
      const books = exportableDetector.extractBooks();

      eventHandler.send(EventType.SetBooks, { books });
    } else {
      eventHandler.send(EventType.SetBooks, { books: [] });
    }
  });
})();
