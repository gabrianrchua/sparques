const { loadImage, Image } = require('canvas');

/**
 * Draw a brush stroke with an array of coordinates
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
function brush(ctx, { color, width, coordinates }) {
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
function circle(ctx, { color, width, center, radius }) {
  if (!ctx || !color || !width || !center || !center.x || !center.y || !radius) throw new Error("Invalid arguments");

  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

/**
 * Draw a rectangle
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
function rectangle(ctx, { color, width, topLeftCoordinates, bottomRightCoordinates }) {
  if (!ctx || !color || !width || !topLeftCoordinates || !topLeftCoordinates.x || !topLeftCoordinates.y || !bottomRightCoordinates || !bottomRightCoordinates.x || !bottomRightCoordinates.y) throw new Error("Invalid arguments");

  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  ctx.strokeRect(topLeftCoordinates.x, topLeftCoordinates.y, Math.abs(topLeftCoordinates.x - bottomRightCoordinates.x), Math.abs(topLeftCoordinates.y - bottomRightCoordinates.y));
}

/**
 * Draw an n-sided regular polygon
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
function polygon(ctx, { color, width, numSides, center, sideLength }) {
  if (!color || !width || !numSides || numSides < 3 || !center || !center.x || !center.y || !sideLength) throw new Error("Invalid arguments");

  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  // https://stackoverflow.com/a/11354824
  ctx.beginPath();
  ctx.moveTo(center.x + sideLength * Math.cos(0), center.y + sideLength * Math.sin(0));

  for (let i = 1; i <= numSides; i++) {
    ctx.lineTo(center.x + sideLength * Math.cos(i * 2 * Math.PI / numSides), center.y + sideLength * Math.sin(i * 2 * Math.PI / numSides));
  }

  ctx.stroke();
}

/**
 * Write text
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
function text(ctx, { color, fontSize, topLeftCoordinates, text }) {
  if (!color || !fontSize || !topLeftCoordinates || !topLeftCoordinates.x || !topLeftCoordinates.y || !text) throw new Error("Invalid arguments");

  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = color;

  ctx.fillText(text, topLeftCoordinates.x, topLeftCoordinates.y, Math.abs(topLeftCoordinates.x - 512));
}

/*
  Flood fill code below courtesy of https://stackoverflow.com/a/56221940
*/

/**
 * Flood (bucket) fill at a section of the canvas
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
function fill(ctx, { color, coordinates }) {
  if (!color || !coordinates || !coordinates.x || !coordinates.y) throw new Error("Invalid arguments");

  const x = coordinates.x;
  const y = coordinates.y;
  color = parseInt("0xFF" + color.replace("#", ""), 16);

  // read the pixels in the canvas
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  // make a Uint32Array view on the pixels so we can manipulate pixels
  // one 32bit value at a time instead of as 4 bytes per pixel
  const pixelData = {
    width: imageData.width,
    height: imageData.height,
    data: new Uint32Array(imageData.data.buffer),
  };

  // get the color we're filling
  const targetColor = getPixel(pixelData, x, y);

  // check we are actually filling a different color
  if (targetColor !== color) {
    const spansToCheck = [];

    function addSpan(left, right, y, direction) {
      spansToCheck.push({ left, right, y, direction });
    }

    function checkSpan(left, right, y, direction) {
      let inSpan = false;
      let start;
      let x;
      for (x = left; x < right; ++x) {
        const color = getPixel(pixelData, x, y);
        if (color === targetColor) {
          if (!inSpan) {
            inSpan = true;
            start = x;
          }
        } else {
          if (inSpan) {
            inSpan = false;
            addSpan(start, x - 1, y, direction);
          }
        }
      }
      if (inSpan) {
        inSpan = false;
        addSpan(start, x - 1, y, direction);
      }
    }

    addSpan(x, x, y, 0);

    while (spansToCheck.length > 0) {
      const { left, right, y, direction } = spansToCheck.pop();

      // do left until we hit something, while we do this check above and below and add
      let l = left;
      for (; ;) {
        --l;
        const color = getPixel(pixelData, l, y);
        if (color !== targetColor) {
          break;
        }
      }
      ++l

      let r = right;
      for (; ;) {
        ++r;
        const color = getPixel(pixelData, r, y);
        if (color !== targetColor) {
          break;
        }
      }

      const lineOffset = y * pixelData.width;
      pixelData.data.fill(color, lineOffset + l, lineOffset + r);

      if (direction <= 0) {
        checkSpan(l, r, y - 1, -1);
      } else {
        checkSpan(l, left, y - 1, -1);
        checkSpan(right, r, y - 1, -1);
      }

      if (direction >= 0) {
        checkSpan(l, r, y + 1, +1);
      } else {
        checkSpan(l, left, y + 1, +1);
        checkSpan(right, r, y + 1, +1);
      }
    }
    // put the data back
    ctx.putImageData(imageData, 0, 0);
  }
}

function getPixel(pixelData, x, y) {
  if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
    return -1;  // impossible color
  } else {
    return pixelData.data[y * pixelData.width + x];
  }
}

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

module.exports = { brush, circle, rectangle, polygon, text, fill, drawStrokes };