import { brush } from "./draw.js"

let ctx;

export function init(canvas) {
  ctx = canvas.getContext("2d");
  brush(ctx, { color: "#000000", width: 3, coordinates: [
    {x: 10, y: 10}, {x: 10, y: 50}, {x: 50, y: 50}, {x: 100, y: 100}
  ]});
}