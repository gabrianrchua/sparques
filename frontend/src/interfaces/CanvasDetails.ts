export default interface CanvasDetails {
  _id: string,
  title: string,
  strokes: any[], // TODO: add interfaces for all stroke types instead of any[]
  baseImage: string,
}