import debounce from 'lodash/debounce';
import Detectors from '@src/detectors';
import EventHandler, { EventType } from '@src/utils/eventHandler';

(() => {
  const eventHandler = new EventHandler();
  const detectors = Detectors.map(Detector => new Detector(window));
  const mutationObserver = new MutationObserver(debounce(() => {
    const exportableDetector = detectors.find(detector => detector.isExportable());
    const books = exportableDetector ? exportableDetector.extractBooks() : [];

    eventHandler.sendToExtension(EventType.SetBooks, { books });
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
