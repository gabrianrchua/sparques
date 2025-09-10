import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router"
import NetworkService from "../services/Network";
import CanvasDetails from "../interfaces/CanvasDetails";
import { Skeleton } from "@mui/material";
import { brush, circle, rectangle, polygon, text, fill } from "sparques-canvas/draw";
import { CanvasRenderingContext2D, Image } from 'canvas';

async function drawStrokes(ctx: CanvasRenderingContext2D, strokes: any[], baseImage: string) {
  if (!ctx || !strokes) throw new Error("Invalid arguments");

  const img = new Image();
  img.src = `data:image/png;base64,${baseImage}`;
  img.onload = function() {
    ctx.drawImage(img as Image, 0, 0, 512, 512);

    // draw the rest of the strokes
    for (let i = 0; i < strokes.length; i++) {
      const stroke = strokes[i];
  
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
            console.error(`Invalid drawing stroke of type "${stroke.type}"`, stroke);
        }
      } catch (err) {
        console.error(`Error drawing stroke of type "${stroke.type}"`, stroke, err);
      }
    }
  }
}

export default function Canvas() {
  const location = useLocation();
  const { community } = useParams();
  const [canvasDetails, setCanvasDetails] = useState<CanvasDetails | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : undefined;

    if (!canvasDetails || !ctx) return;

    // HACK: to get types to "match"
    drawStrokes(ctx as unknown as CanvasRenderingContext2D, canvasDetails.strokes, canvasDetails.baseImage);
  }, [canvasDetails])

  useEffect(() => {
    // only if this page became active
    if (!community) return;

    if (location.pathname === "/c/" + community + "/canvas") {
      NetworkService.getCanvas(community).then(canvasDetails => setCanvasDetails(canvasDetails));
    }
  }, [location.pathname]);

  return canvasDetails ? (
    <>
      <h3>{`c/${community} Canvas`}</h3>
      <canvas ref={canvasRef} width={512} height={512} style={{ backgroundColor: "white" }} />
    </>
  ) : (
    <Skeleton variant="rounded" height={800} />
  )
}