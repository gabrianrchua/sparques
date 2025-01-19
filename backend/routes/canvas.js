const express = require('express');
const { requireAuth } = require('../routes/auth');
const { Stroke, Brush, Circle, Rectangle, Polygon, Text, Fill } = require('../models/Stroke');
const Canvas = require('../models/Canvas');
const Community = require('../models/Community');

const router = express.Router();

// @route   GET /api/canvas/
// @desc    Get list of the names of all canvases
router.get("/", async (req, res) => {
  try {
    const titles = await Canvas.find().select("title");
    res.json(titles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
});

// @route   GET /api/canvas/:canvas
// @desc    Get all strokes and base image for canvas
router.get("/:canvas", async (req, res) => {
  const canvas = req.params.canvas;
  if (!canvas) return res.status(400).json({ message: "Invalid canvas name" });

  try {
    const fetchedCanvas = await Canvas.findOne({ title: canvas });
    if (!fetchedCanvas) return res.status(404).json({ message: "Canvas not found" });
    res.json(fetchedCanvas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
});

// @route   POST /api/canvas/:canvas
// @desc    Add a stroke to a canvas
router.post("/:canvas", requireAuth, async (req, res) => {
  const canvas = req.params.canvas;
  const { type, ...toolData } = req.body;

  if (!canvas) return res.status(400).json({ message: "Invalid canvas name" });
  if (!type) return res.status(400).json({ message: "Missing required field 'type'" });

  try {
    // enforce that community exists, create new canvas if necessary
    const community = await Community.findOne({ title: canvas });
    if (!community) return res.status(404).json({ message: "Community does not exist" });

    let fetchedCanvas = await Canvas.findOne({ title: canvas });
    if (!fetchedCanvas) {
      // create new canvas
      const newCanvas = new Canvas({ title: canvas, strokes: [], baseImage: "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TpSIVh3YQcchQXbSLijjWKhShQqgVWnUweekfNGlIUlwcBdeCgz+LVQcXZ10dXAVB8AfEXXBSdJES70sKLWK84ZGP8+45vHcfIDSrTLN6EoCm22YmlRRz+VUx9IoAIvSNIyIzy5iTpDR86+ueuqnu4jzLv+/PGlALFgMCInGCGaZNvEE8s2kbnPeJo6wsq8TnxBMmHZD4keuKx2+cSy4LPDNqZjPzxFFisdTFShezsqkRTxPHVE2nfCHnscp5i7NWrbP2OfkNwwV9ZZnrtEaQwiKWIEGEgjoqqMJGnP46KRYytJ/08Q+7folcCrkqYORYQA0aZNcP/ga/Z2sVpya9pHAS6H1xnI9RILQLtBqO833sOK0TIPgMXOkdf60JzH6S3uhosSNgcBu4uO5oyh5wuQMMPRmyKbtSkJZQLALvZ/RMeSByC/SveXNr7+P0AcjSrNI3wMEhMFai7HWfe/d1z+3fnvb8fgCcn3K3KRdT4wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kBExMrHYlFvbIAAAWYSURBVHja7dUxAQAACMMwwL/n4YGXREKfdpIC4J+RAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAwAAkADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAICbBXlhBv3OgxUDAAAAAElFTkSuQmCC" });
      fetchedCanvas = await newCanvas.save();
    }

    // determine which stroke is being used and assign parameters
    let strokeModel;
    let parameters;

    switch (type.trim().toLowerCase()) {
      case "brush":
        strokeModel = Brush;
        if (!toolData.color || !toolData.width || !toolData.coordinates) return res.status(400).json({ message: "Missing one or more of required fields 'color', 'width', 'coordinates'" });
        parameters = { type: "Brush", color: toolData.color, width: toolData.width, coordinates: toolData.coordinates };
        break;
      case "circle":
        strokeModel = Circle;
        if (!toolData.color || !toolData.width || !toolData.center || !toolData.center.x || !toolData.center.y || !toolData.radius) return res.status(400).json({ message: "Missing one or more of required fields 'color', 'width', 'center', 'radius'" });
        parameters = { type: "Circle", color: toolData.color, width: toolData.width, center: toolData.center, radius: toolData.radius };
        break;
      case "rectangle":
        strokeModel = Rectangle;
        if (!toolData.color || !toolData.width || !toolData.topLeftCoordinates || !toolData.topLeftCoordinates.x || !toolData.topLeftCoordinates.y || !toolData.bottomRightCoordinates || !toolData.bottomRightCoordinates.x || !toolData.bottomRightCoordinates.y) return res.status(400).json({ message: "Missing one or more of required fields 'color', 'width', 'topLeftCoordinates', 'bottomRightCoordinates'" });
        parameters = { type: "Rectangle", color: toolData.color, width: toolData.width, topLeftCoordinates: toolData.topLeftCoordinates, bottomRightCoordinates: toolData.bottomRightCoordinates };
        break;
      case "polygon":
        strokeModel = Polygon;
        if (!toolData.color || !toolData.width || !toolData.numSides || !toolData.center || !toolData.center.x || !toolData.center.y || !toolData.sideLength) return res.status(400).json({ message: "Missing one or more of required fields 'color', 'width', 'numSides', 'center', 'sideLength'" });
        parameters = { type: "Polygon", color: toolData.color, width: toolData.width, numSides: toolData.numSides, center: toolData.center, sideLength: toolData.sideLength };
        break;
      case "text":
        strokeModel = Text;
        if (!toolData.color || !toolData.fontSize || !toolData.topLeftCoordinates || !toolData.topLeftCoordinates.x || !toolData.topLeftCoordinates.y || !toolData.text) return res.status(400).json({ message: "Missing one or more of required fields 'color', 'fontSize', 'topLeftCoordinates', 'text'" });
        parameters = { type: "Text", color: toolData.color, fontSize: toolData.fontSize, topLeftCoordinates: toolData.topLeftCoordinates, text: toolData.text };
        break;
      case "fill":
        strokeModel = Fill;
        if (!toolData.color || !toolData.coordinates || !toolData.coordinates.x || !toolData.coordinates.y) return res.status(400).json({ message: "Missing one or more of required fields 'color', 'coordinates'" });
        parameters = { type: "Fill", color: toolData.color, coordinates: toolData.coordinates };
        break;
      default:
        return res.status(400).json({ message: "Invalid stroke type" });
    }

    const newStroke = new strokeModel(parameters);
    //const savedStroke = await newStroke.save();
    await Canvas.findByIdAndUpdate(fetchedCanvas._id, { $push: { strokes: newStroke } });
    return res.status(201).json(newStroke);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
});

module.exports = router;