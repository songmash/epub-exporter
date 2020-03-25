export default interface Exporter {
  export: () => Promise<Blob>;
}
