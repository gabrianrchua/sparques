/**
 * Draw a brush stroke with an array of coordinates
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
export function brush(ctx: CanvasRenderingContext2D, { color, width, coordinates }: {
    color: string;
    width: number;
    coordinates: { x: number, y: number };
}): void;
/**
 * Draw a circle
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
export function circle(ctx: CanvasRenderingContext2D, { color, width, center, radius }: {
    color: string;
    width: number;
    center: { x: number, y: number };
    radius: number;
}): void;
/**
 * Draw a rectangle
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
export function rectangle(ctx: CanvasRenderingContext2D, { color, width, topLeftCoordinates, bottomRightCoordinates }: {
    color: string;
    width: number;
    topLeftCoordinates: { x: number, y: number };
    bottomRightCoordinates: { x: number, y: number };
}): void;
/**
 * Draw an n-sided regular polygon
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
export function polygon(ctx: CanvasRenderingContext2D, { color, width, numSides, center, sideLength }: {
    color: string;
    width: number;
    numSides: number;
    center: { x: number, y: number };
    sideLength: number;
}): void;
/**
 * Write text
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
export function text(ctx: CanvasRenderingContext2D, { color, fontSize, topLeftCoordinates, text }: {
    color: string;
    fontSize: number;
    topLeftCoordinates: { x: number, y: number };
    text: string;
}): void;
/**
 * Flood (bucket) fill at a section of the canvas
 * @param {CanvasRenderingContext2D} ctx Canvas context 2d
 */
export function fill(ctx: CanvasRenderingContext2D, { color, coordinates }: {
    color: string;
    coordinates: { x: number, y: number };
}): void;
