const { createCanvas } = require("canvas");

const { drawStrokes } = require("../canvas/draw");

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