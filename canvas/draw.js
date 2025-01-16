/**
 * Draw a brush stroke with an array of coordinates
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
export function brush(ctx, {color, width, coordinates}) {
  if (!ctx || !color || !width || !coordinates || coordinates.length == 0) throw new Error("Invalid arguments");
  
  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  ctx.beginPath();

  for (let i = 0; i < coordinates.length; i++) {
    if (i == 0) {
      ctx.moveTo(coordinates[0].x, coordinates[0].y);
    } else {
      ctx.lineTo(coordinates[i].x, coordinates[i].y);
    }
  }

  ctx.stroke();
}

/**
 * Draw a circle
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
export function circle(ctx, {color, width, center, radius}) {
  if (!ctx || !color || !width || !center || !center.x || !center.y || !radius) throw new Error("Invalid arguments");

  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}