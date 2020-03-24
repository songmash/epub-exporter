import { Source } from '@src/types/book';
import ReadmooExporter from '@src/exporters/readmooExporter';

export const exporterSelector = (source: Source) => {
  switch (source) {
  case Source.Readmoo:
    return new ReadmooExporter();
  default:
    throw new Error('Undefined Exporter');
  }
};

export default [
  ReadmooExporter,
];
