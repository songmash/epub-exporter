import axios, { AxiosRequestConfig } from 'axios';
import BaseExporter from '@src/exporters/baseExporter';

const apiBase = 'https://reader.readmoo.com';

const decoder = new TextDecoder('utf-8');

const arrayBufferToString = (buffer: ArrayBuffer) => decoder.decode(new Uint8Array(buffer));

const config: AxiosRequestConfig = {
  withCredentials: true,
  headers: {
    authorization: 'bearer wyr0ofzt3TFciX-xhbQDCg',
  },
  responseType: 'arraybuffer',
};

const get = async (path: string) => (await axios.get(`${apiBase}${path}`, config)).data;

const obtainBasePath = (path: string) => {
  const segments = path.split('/');
  segments.pop();

  return segments.join('/');
};

class ReadmooExporter extends BaseExporter {
  private basePath = '';

  async export(): Promise<Blob> {
    const containerXmlPath = 'META-INF/container.xml';
    const encryptionXmlPath = 'META-INF/encryption.xml';

    await this.fetchBasePath();
    await this.batchFetch([containerXmlPath, encryptionXmlPath], [encryptionXmlPath]);
    const rootFilePath = this.rootFilePath(containerXmlPath);
    await this.batchFetch([rootFilePath]);
    await this.batchFetch(this.contentFilePaths(rootFilePath));

    return this.buildEPUB();
  }

  private async fetchBasePath() {
    await this.updateMessage('取得檔案路徑');
    await this.increasePending();

    const { id } = this.book;
    const arrayBuffer = await get(`/api/book/${id}/nav`);
    const object = JSON.parse(arrayBufferToString(arrayBuffer));
    this.basePath = object.base as string;

    await this.increaseFinished();
  }

  /* eslint-disable no-await-in-loop, no-restricted-syntax, no-continue */
  private async batchFetch(paths: string[], ignoreErrorPaths: string[] = []) {
    await this.increasePending(paths.length);

    for (const path of paths) {
      const message = `取得 ${path}`;
      await this.updateStatus(() => ({ message }));

      try {
        this.files[path] = await get(this.resolvePath(path));
      } catch (e) {
        if (ignoreErrorPaths.includes(path)) {
          await this.updateMessage(`${message}...失敗（可忽略）`);
        } else {
          throw e;
        }
      }

      await this.increaseFinished();
    }
  }
  /* eslint-enable no-await-in-loop, no-restricted-syntax, no-continue */

  private async updateMessage(message: string) {
    await this.updateStatus((() => ({ message })));
  }

  private async increasePending(count = 1) {
    await this.updateStatus((old => ({ itemsCount: old.itemsCount + count })));
  }

  private async increaseFinished(count = 1) {
    await this.updateStatus((old => ({ itemsCountCompleted: old.itemsCountCompleted + count })));
  }

  private resolvePath(path: string): string {
    return this.basePath + path;
  }

  private rootFilePath(containerXmlPath: string): string {
    const containerXml = arrayBufferToString(this.files[containerXmlPath] as ArrayBuffer);

    return containerXml.match(/rootfile.*full-path="(.+\.opf)"/)[1];
  }

  private contentFilePaths(rootFilePath: string): string[] {
    const basePath = obtainBasePath(rootFilePath);
    const rootFile = arrayBufferToString(this.files[rootFilePath] as ArrayBuffer);

    return [...rootFile.matchAll(/.*href="(.*?)".*/g)].map(([_self, path]) => `${basePath}/${path}`);
  }
}
export default ReadmooExporter;
