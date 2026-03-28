import {
  Brush,
  Circle,
  FormatColorFill,
  Pentagon,
  Rectangle,
  TextFields,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { StrokeType } from '@sparques/types';
import ToolOptions, { ToolOptionsProps } from './ToolOptions';

interface ToolPanelProps {
  selectedStroke: StrokeType | null;
  setSelectedStroke: (value: StrokeType | null) => void;
  color?: string;
  setColor?: (c: string) => void;
  width?: number;
  setWidth?: (w: number) => void;
  text?: string;
  setText?: (t: string) => void;
  numSides?: number;
  setNumSides?: (n: number) => void;
  sideLength?: number;
  setSideLength?: (l: number) => void;
  fontSize?: number;
  setFontSize?: (f: number) => void;
}

const ToolPanel = ({
  selectedStroke,
  setSelectedStroke,
  color,
  setColor,
  width,
  setWidth,
  text,
  setText,
  numSides,
  setNumSides,
  sideLength,
  setSideLength,
  fontSize,
  setFontSize,
}: ToolPanelProps) => {
  const toolOptionsProps: ToolOptionsProps = {
    selectedStroke,
    color: color ?? '#000000',
    setColor: setColor ?? ((c) => c),
    width: width ?? 5,
    setWidth: setWidth ?? ((w) => w),
    text,
    setText,
    numSides,
    setNumSides,
    sideLength,
    setSideLength,
    fontSize,
    setFontSize,
  };

  return (
    <Box paddingBottom='12px' gap='6px'>
      <Box paddingBottom='8px' display='flex' flexWrap='wrap' gap='4px'>
        <Button
          variant={selectedStroke === 'Brush' ? 'contained' : 'outlined'}
          startIcon={<Brush />}
          onClick={() =>
            setSelectedStroke(selectedStroke === 'Brush' ? null : 'Brush')
          }
        >
          Brush
        </Button>
        <Button
          variant={selectedStroke === 'Circle' ? 'contained' : 'outlined'}
          startIcon={<Circle />}
          onClick={() =>
            setSelectedStroke(selectedStroke === 'Circle' ? null : 'Circle')
          }
        >
          Circle
        </Button>
        <Button
          variant={selectedStroke === 'Rectangle' ? 'contained' : 'outlined'}
          startIcon={<Rectangle />}
          onClick={() =>
            setSelectedStroke(
              selectedStroke === 'Rectangle' ? null : 'Rectangle'
            )
          }
        >
          Rectangle
        </Button>
        <Button
          variant={selectedStroke === 'Polygon' ? 'contained' : 'outlined'}
          startIcon={<Pentagon />}
          onClick={() =>
            setSelectedStroke(selectedStroke === 'Polygon' ? null : 'Polygon')
          }
        >
          Polygon
        </Button>
        <Button
          variant={selectedStroke === 'Text' ? 'contained' : 'outlined'}
          startIcon={<TextFields />}
          onClick={() =>
            setSelectedStroke(selectedStroke === 'Text' ? null : 'Text')
          }
        >
          Text
        </Button>
        <Button
          variant={selectedStroke === 'Fill' ? 'contained' : 'outlined'}
          startIcon={<FormatColorFill />}
          onClick={() =>
            setSelectedStroke(selectedStroke === 'Fill' ? null : 'Fill')
          }
        >
          Fill
        </Button>
      </Box>
      {selectedStroke && <ToolOptions {...toolOptionsProps} />}
    </Box>
  );
};

export default ToolPanel;
