interface Coordinate {
  x: number;
  y: number;
}

export interface BrushStroke {
  color: string;
  width: number;
  coordinates: Coordinate[];
}

export interface CircleStroke {
  color: string;
  width: number;
  center: Coordinate;
  radius: number;
}

export interface RectangleStroke {
  color: string;
  width: number;
  topLeftCoordinates: Coordinate;
  bottomRightCoordinates: Coordinate;
}

export interface PolygonStroke {
  color: string;
  width: number;
  numSides: number;
  center: Coordinate;
  sideLength: number;
}

export interface TextStroke {
  color: string;
  fontSize: number;
  topLeftCoordinates: Coordinate;
  text: string;
}

export interface FillStroke {
  color: string;
  coordinates: Coordinate;
}

export type AnyStroke =
  | BrushStroke
  | CircleStroke
  | RectangleStroke
  | PolygonStroke
  | TextStroke
  | FillStroke;
