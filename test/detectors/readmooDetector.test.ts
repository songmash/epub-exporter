import fs from 'fs';
import { JSDOM } from 'jsdom';

import ReadmooDetector from '@src/detectors/readmooDetector';
import Book, { Source } from '@src/types/book';


describe('ReadmooDetector', () => {
  const dom = new JSDOM();
  const { window } = dom;

  describe('#isExportable', () => {
    it('return true if hostname is library hostname', () => {
      dom.reconfigure({ url: 'https://read.readmoo.com/#/dashboard' });

      const detector = new ReadmooDetector(window as unknown as Window);

      expect(detector.isExportable()).toEqual(true);
    });

    it('return false if hostname is not library hostname', () => {
      dom.reconfigure({ url: 'https://www.google.com.tw/' });

      const detector = new ReadmooDetector(window as unknown as Window);

      expect(detector.isExportable()).toEqual(false);
    });
  });

  describe('#extractBooks', () => {
    it('return empty array if no book found', () => {
      const detector = new ReadmooDetector(window as unknown as Window);
      const books: Book[] = [];

      expect(detector.extractBooks()).toEqual(books);
    });

    it('return books', () => {
      const html = fs.readFileSync('test/fixtures/readmooDetector/library.html').toString();
      const libraryDOM = new JSDOM(html);
      const detector = new ReadmooDetector(libraryDOM.window as unknown as Window);
      const source = Source.Readmoo;
      const books: Book[] = [
        {
          id: '210107551000101', title: '超人高中生們即便在異世界也能從容生存！(04)', coverImageUrl: 'https://cdn.readmoo.com/cover/pp/rgnhukg_210x315.jpg?v=1557158412', source,
        },
        {
          id: '210107550000101', title: '超人高中生們即便在異世界也能從容生存！(03)', coverImageUrl: 'https://cdn.readmoo.com/cover/qi/pqkovlf_210x315.jpg?v=1557158345', source,
        },
        {
          id: '210107549000101', title: '超人高中生們即便在異世界也能從容生存！(02)', coverImageUrl: 'https://cdn.readmoo.com/cover/mz/pirjtpd_210x315.jpg?v=1557158427', source,
        },
        {
          id: '210107548000101', title: '超人高中生們即便在異世界也能從容生存！(01)', coverImageUrl: 'https://cdn.readmoo.com/cover/nj/pcpczoc_210x315.jpg?v=1557158341', source,
        },
        {
          id: '210096868000101', title: '10個月從五十音直接通過日檢1級：裘莉的日語神器', coverImageUrl: 'https://cdn.readmoo.com/cover/bf/ifdck94_210x315.jpg?v=1538993924', source,
        },
      ];

      expect(detector.extractBooks()).toEqual(books);
    });
  });
});
