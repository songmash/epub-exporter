import { DetectorConstructor } from '@src/types/detector';
import ReadmooDetector from '@src/detectors/readmooDetector';

const detectors: DetectorConstructor[] = [
  ReadmooDetector,
];
export default detectors;
