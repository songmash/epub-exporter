export default (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => { reject(new Error('Invalid Blob')); };
  reader.onloadend = () => { resolve(reader.result as string); };

  try {
    reader.readAsDataURL(blob);
  } catch (e) {
    reject(new Error('Invalid Blob'));
  }
});
