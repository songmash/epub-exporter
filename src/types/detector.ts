import Book from '@src/types/book';

export default interface Detector {
  isExportable: () => boolean;
  extractBooks: () => Book[];
}

export interface DetectorConstructor {
  new (window: Window): Detector;
}
