import { exporterSelector } from '@src/exporters';
import { Source } from '@src/types/book';
import BaseExporter from '@src/exporters/baseExporter';

describe('exporterSelector', () => {
  it('return Exporter by source', () => {
    Object.values(Source).forEach(source => {
      const exporter = exporterSelector(source);

      expect(exporter).toBeInstanceOf(BaseExporter);
    });
  });

  it('throw Error with undefined source', () => {
    expect(() => { exporterSelector('invalid' as Source); }).toThrow('Undefined Exporter')
  });
});
