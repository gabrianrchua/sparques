import { brush, circle, fill, polygon, rectangle, text } from "./draw.js"

// CLIENT SIDE DRIVER CODE TEST

let ctx;

export function init(canvas) {
  ctx = canvas.getContext("2d");
  brush(ctx, {
    color: "#ff0000", width: 3, coordinates: [
      { x: 10, y: 10 }, { x: 10, y: 50 }, { x: 50, y: 50 }, { x: 100, y: 100 }
    ]
  });
  circle(ctx, { color: "#00ff00", width: 5, center: { x: 100, y: 100 }, radius: 50 });
  rectangle(ctx, { color: "#0000ff", width: 2, topLeftCoordinates: { x: 100, y: 100 }, bottomRightCoordinates: { x: 200, y: 150 } });
  polygon(ctx, { color: "#ffff00", width: 5, center: { x: 300, y: 300 }, numSides: 5, sideLength: 50 });
  polygon(ctx, { color: "#00ffff", width: 5, center: { x: 350, y: 350 }, numSides: 8, sideLength: 50 });
  text(ctx, { color: "#808080", fontSize: 20, topLeftCoordinates: { x: 50, y: 400 }, text: "my text" });
  text(ctx, { color: "#ff00ff", fontSize: 20, topLeftCoordinates: { x: 300, y: 400 }, text: "some very long text. i'm not sure if it'll wrap (probably not). hopefully my math is right." });
  fill(ctx, { color: "#ff00ff", coordinates: { x: 90, y: 100 } });
}