import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router"
import NetworkService from "../services/Network";
import CanvasDetails from "../interfaces/CanvasDetails";
import { Skeleton } from "@mui/material";

export default function Canvas() {
  const location = useLocation();
  const { community } = useParams();
  const [canvasDetails, setCanvasDetails] = useState<CanvasDetails | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : undefined;
  }, [])

  useEffect(() => {
    // only if this page became active
    if (!community) return;

    if (location.pathname === "/c/" + community + "/canvas") {
      NetworkService.getCanvas(community).then(canvasDetails => setCanvasDetails(canvasDetails));
    }
  // eslint-disable-next-line
  }, [location.pathname]);

  return canvasDetails ? (
    <>
      <h3>{`c/${community} Canvas`}</h3>
      <canvas ref={canvasRef} width={512} height={512} />
    </>
  ) : (
    <Skeleton variant="rounded" height={800} />
  )
}