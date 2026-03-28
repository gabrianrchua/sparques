import { Box, Slider, TextField, Typography } from '@mui/material';
import { StrokeType } from '@sparques/types';

export type ToolOptionsProps = {
  selectedStroke?: StrokeType | null;
  color: string;
  setColor: (c: string) => void;
  width: number;
  setWidth: (w: number) => void;
  text?: string;
  setText?: (t: string) => void;
  numSides?: number;
  setNumSides?: (n: number) => void;
  sideLength?: number;
  setSideLength?: (l: number) => void;
  fontSize?: number;
  setFontSize?: (f: number) => void;
};

const ToolOptions = ({
  selectedStroke,
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
}: ToolOptionsProps) => {
  const activeTool = selectedStroke;
  const showsColor = activeTool !== null && activeTool !== undefined;
  const showsWidth =
    activeTool === 'Brush' ||
    activeTool === 'Circle' ||
    activeTool === 'Rectangle' ||
    activeTool === 'Polygon';
  const showsPolygonOptions = activeTool === 'Polygon';
  const showsTextOptions = activeTool === 'Text';

  return (
    <Box display='flex' flexDirection='column' gap='4px' p='2'>
      {showsColor && (
        <TextField
          label='Color'
          type='text'
          variant='outlined'
          value={color}
          onChange={(event) => setColor(event.target.value)}
          sx={{ width: '100%', textTransform: 'uppercase' }}
        />
      )}

      {showsWidth && (
        <>
          <Typography variant='body2'>Stroke width</Typography>
          <Slider
            min={1}
            max={50}
            step={1}
            value={width}
            onChange={(_, newValue) => setWidth(newValue as number)}
            aria-label='stroke width'
            valueLabelDisplay='auto'
          />
        </>
      )}

      {showsPolygonOptions && (
        <>
          <Typography variant='body2'>Number of sides</Typography>
          <Slider
            min={3}
            max={20}
            step={1}
            value={numSides || 4}
            onChange={(_, newValue) => setNumSides?.(newValue as number)}
            aria-label='number of sides'
            valueLabelDisplay='auto'
          />
          <Typography variant='body2'>Side length</Typography>
          <Slider
            min={10}
            max={200}
            step={1}
            value={sideLength || 50}
            onChange={(_, newValue) => setSideLength?.(newValue as number)}
            aria-label='side length'
            valueLabelDisplay='auto'
          />
        </>
      )}

      {showsTextOptions && (
        <>
          <Typography variant='body2'>Font size</Typography>
          <Slider
            min={12}
            max={72}
            step={1}
            value={fontSize || 24}
            onChange={(_, newValue) => setFontSize?.(newValue as number)}
            aria-label='font size'
            valueLabelDisplay='auto'
          />
          <TextField
            label='Text content'
            variant='outlined'
            multiline
            maxRows={2}
            value={text || ''}
            onChange={(event) => setText?.(event.target.value)}
            sx={{ width: '100%' }}
          />
        </>
      )}
    </Box>
  );
};

export default ToolOptions;
