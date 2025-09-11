import { Request, Response } from 'express';
import {
  Brush,
  Circle,
  Rectangle,
  Polygon,
  Text,
  Fill,
} from '../../models/Stroke';
import { render } from '../../canvas/canvas';
import Canvas from '../../models/Canvas';
import Community from '../../models/Community';

const MAX_STROKES = 5; // how many strokes before flushing to base image

export const addStroke = async (req: Request, res: Response) => {
  const canvas = req.params.canvas;
  const { type, ...toolData } = req.body;

  if (!canvas) return res.status(400).json({ message: 'Invalid canvas name' });
  if (!type)
    return res.status(400).json({ message: "Missing required field 'type'" });

  try {
    // enforce that community exists, create new canvas if necessary
    const community = await Community.findOne({ title: canvas });
    if (!community)
      return res.status(404).json({ message: 'Community does not exist' });

    let fetchedCanvas = await Canvas.findOne({ title: canvas });
    if (!fetchedCanvas) {
      // create new canvas
      const newCanvas = new Canvas({
        title: canvas,
        strokes: [],
        baseImage:
          'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TpSIVh3YQcchQXbSLijjWKhShQqgVWnUweekfNGlIUlwcBdeCgz+LVQcXZ10dXAVB8AfEXXBSdJES70sKLWK84ZGP8+45vHcfIDSrTLN6EoCm22YmlRRz+VUx9IoAIvSNIyIzy5iTpDR86+ueuqnu4jzLv+/PGlALFgMCInGCGaZNvEE8s2kbnPeJo6wsq8TnxBMmHZD4keuKx2+cSy4LPDNqZjPzxFFisdTFShezsqkRTxPHVE2nfCHnscp5i7NWrbP2OfkNwwV9ZZnrtEaQwiKWIEGEgjoqqMJGnP46KRYytJ/08Q+7folcCrkqYORYQA0aZNcP/ga/Z2sVpya9pHAS6H1xnI9RILQLtBqO833sOK0TIPgMXOkdf60JzH6S3uhosSNgcBu4uO5oyh5wuQMMPRmyKbtSkJZQLALvZ/RMeSByC/SveXNr7+P0AcjSrNI3wMEhMFai7HWfe/d1z+3fnvb8fgCcn3K3KRdT4wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kBExMrHYlFvbIAAAWYSURBVHja7dUxAQAACMMwwL/n4YGXREKfdpIC4J+RAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAwAAkADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAMAAADAAAAwDAAAAwAAAMAAADAMAAADAAAAwAAAMAwAAAMAAADAAAAwDAAAAwAAAMAICbBXlhBv3OgxUDAAAAAElFTkSuQmCC',
      });
      fetchedCanvas = await newCanvas.save();
    }

    // determine which stroke is being used and assign parameters
    let strokeModel;
    let parameters;

    switch (type.trim().toLowerCase()) {
      case 'brush':
        strokeModel = Brush;
        if (!toolData.color || !toolData.width || !toolData.coordinates)
          return res.status(400).json({
            message:
              "Missing one or more of required fields 'color', 'width', 'coordinates'",
          });
        parameters = {
          type: 'Brush',
          color: toolData.color,
          width: toolData.width,
          coordinates: toolData.coordinates,
        };
        break;
      case 'circle':
        strokeModel = Circle;
        if (
          !toolData.color ||
          !toolData.width ||
          !toolData.center ||
          !toolData.center.x ||
          !toolData.center.y ||
          !toolData.radius
        )
          return res.status(400).json({
            message:
              "Missing one or more of required fields 'color', 'width', 'center', 'radius'",
          });
        parameters = {
          type: 'Circle',
          color: toolData.color,
          width: toolData.width,
          center: toolData.center,
          radius: toolData.radius,
        };
        break;
      case 'rectangle':
        strokeModel = Rectangle;
        if (
          !toolData.color ||
          !toolData.width ||
          !toolData.topLeftCoordinates ||
          !toolData.topLeftCoordinates.x ||
          !toolData.topLeftCoordinates.y ||
          !toolData.bottomRightCoordinates ||
          !toolData.bottomRightCoordinates.x ||
          !toolData.bottomRightCoordinates.y
        )
          return res.status(400).json({
            message:
              "Missing one or more of required fields 'color', 'width', 'topLeftCoordinates', 'bottomRightCoordinates'",
          });
        parameters = {
          type: 'Rectangle',
          color: toolData.color,
          width: toolData.width,
          topLeftCoordinates: toolData.topLeftCoordinates,
          bottomRightCoordinates: toolData.bottomRightCoordinates,
        };
        break;
      case 'polygon':
        strokeModel = Polygon;
        if (
          !toolData.color ||
          !toolData.width ||
          !toolData.numSides ||
          !toolData.center ||
          !toolData.center.x ||
          !toolData.center.y ||
          !toolData.sideLength
        )
          return res.status(400).json({
            message:
              "Missing one or more of required fields 'color', 'width', 'numSides', 'center', 'sideLength'",
          });
        parameters = {
          type: 'Polygon',
          color: toolData.color,
          width: toolData.width,
          numSides: toolData.numSides,
          center: toolData.center,
          sideLength: toolData.sideLength,
        };
        break;
      case 'text':
        strokeModel = Text;
        if (
          !toolData.color ||
          !toolData.fontSize ||
          !toolData.topLeftCoordinates ||
          !toolData.topLeftCoordinates.x ||
          !toolData.topLeftCoordinates.y ||
          !toolData.text
        )
          return res.status(400).json({
            message:
              "Missing one or more of required fields 'color', 'fontSize', 'topLeftCoordinates', 'text'",
          });
        parameters = {
          type: 'Text',
          color: toolData.color,
          fontSize: toolData.fontSize,
          topLeftCoordinates: toolData.topLeftCoordinates,
          text: toolData.text,
        };
        break;
      case 'fill':
        strokeModel = Fill;
        if (
          !toolData.color ||
          !toolData.coordinates ||
          !toolData.coordinates.x ||
          !toolData.coordinates.y
        )
          return res.status(400).json({
            message:
              "Missing one or more of required fields 'color', 'coordinates'",
          });
        parameters = {
          type: 'Fill',
          color: toolData.color,
          coordinates: toolData.coordinates,
        };
        break;
      default:
        return res.status(400).json({ message: 'Invalid stroke type' });
    }

    const newStroke = new strokeModel(parameters);
    //const savedStroke = await newStroke.save();
    await Canvas.findByIdAndUpdate(fetchedCanvas._id, {
      $push: { strokes: newStroke },
    });
    res.status(201).json(newStroke); // send response now and then flush strokes to base image next if necessary

    if (fetchedCanvas.strokes.length + 1 > MAX_STROKES) {
      try {
        fetchedCanvas = await Canvas.findOne({ title: canvas }); // re-fetch canvas after new stroke
        if (!fetchedCanvas) {
          throw new Error(
            'Fetched canvas was undefined while trying to re-render!',
          );
        }
        const newBaseImage = await render(
          fetchedCanvas.strokes.toObject(),
          fetchedCanvas.baseImage,
        );
        await Canvas.findByIdAndUpdate(fetchedCanvas._id, {
          baseImage: newBaseImage,
          strokes: [],
        });
      } catch (error) {
        console.error(`Error while rendering out canvas "${canvas}"`, error);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};
