const { loadImage, createCanvas } = require('canvas');
const { brush, circle, rectangle, polygon, text, fill } = require("../../canvas/draw");

/**
 * Clear canvas, apply base image, and draw all strokes
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 * @param {Array} strokes List of stroke objects to draw onto the canvas
 * @param {string} baseImage base64 encoded `image/png`
 */
async function drawStrokes(ctx, strokes, baseImage) {
  if (!ctx || !strokes) throw new Error("Invalid arguments");

  const img = await loadImage(`data:image/png;base64,${baseImage}`);

  ctx.drawImage(img, 0, 0, 512, 512);

  for (let i = 0; i < strokes.length; i++) {
    const stroke = strokes[i].toObject();

    try {
      switch (stroke.type) {
        case "Brush":
          brush(ctx, stroke);
          break;
        case "Circle":
          circle(ctx, stroke);
          break;
        case "Rectangle":
          rectangle(ctx, stroke);
          break;
        case "Polygon":
          polygon(ctx, stroke);
          break;
        case "Text":
          text(ctx, stroke);
          break;
        case "Fill":
          fill(ctx, stroke);
          break;
        default:
          console.error(`Invalid drawing stroke of type "${stroke.type}"`, stroke, err);
      }
    } catch (err) {
      console.error(`Error drawing stroke of type "${stroke.type}"`, stroke, err);
    }
  }
}

/**
 * Render out all strokes onto base image, returning new base image
 * @param {Array} strokes Array of stroke objects
 * @param {string} baseImage Base64 base image/png
 * @returns {Promise<string>} Base64 new base image/png
 */
async function render(strokes, baseImage) {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');

  await drawStrokes(ctx, strokes, baseImage);

  return canvas.toDataURL("image/png").replace("data:image/png;base64,", "");
}

module.exports = { render };