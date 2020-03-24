import blobToDataUrl from '@src/utils/blobToDataUrl';

describe('blobToDataUrl', () => {
  it('return dataUrl', async () => {
    const blob = new Blob([JSON.stringify({ hello: 'world' }, null, 2)], { type: 'application/json' });
    const dataUrl = await blobToDataUrl(blob);
    const expectDataUrl = 'data:application/json;base64,ewogICJoZWxsbyI6ICJ3b3JsZCIKfQ==';

    expect(dataUrl).toBe(expectDataUrl);
  });

  it('throw error with invalid blob', async () => {
    const blob = undefined as unknown as Blob;

    expect.assertions(1);
    try {
      await blobToDataUrl(blob);
    } catch (e) {
      expect(e.message).toEqual('Invalid Blob');
    }
  });
});
