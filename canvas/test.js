import { brush, circle } from "./draw.js"

// CLIENT SIDE DRIVER CODE TEST

let ctx;

export function init(canvas) {
  ctx = canvas.getContext("2d");
  brush(ctx, { color: "#ff0000", width: 3, coordinates: [
    {x: 10, y: 10}, {x: 10, y: 50}, {x: 50, y: 50}, {x: 100, y: 100}
  ]});
  circle(ctx, {color: "#00ff00", width: 5, center: {x: 100, y: 100}, radius: 50});
}