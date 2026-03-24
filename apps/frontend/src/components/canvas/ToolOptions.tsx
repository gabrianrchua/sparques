import { Box, Slider, TextField } from '@mui/material';

export type ToolOptionsProps = {
  selectedStroke?: string | null;
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

  return (
    <Box display='flex' flexDirection='column' gap='4px' p='2'>
      {/* Color picker for all tools */}
      <TextField
        label='Color'
        type='text'
        variant='outlined'
        value={color}
        onChange={(event) => setColor(event.target.value)}
        sx={{ width: '100%', textTransform: 'uppercase' }}
      />

      {/* Width slider for most tools (not Fill) */}
      {activeTool !== 'Fill' && (
        <Slider
          min={1}
          max={50}
          step={1}
          value={width}
          onChange={(event, newValue) => setWidth(newValue as number)}
          aria-label='stroke width'
          valueLabelDisplay='auto'
        />
      )}

      {/* Tool-specific options */}
      {activeTool === 'Polygon' && (
        <>
          <Slider
            min={3}
            max={20}
            step={1}
            value={numSides || 4}
            onChange={(event, newValue) => setNumSides(newValue as number)}
            aria-label='number of sides'
            valueLabelDisplay='auto'
          />
          <Slider
            min={10}
            max={200}
            step={1}
            value={sideLength || 50}
            onChange={(event, newValue) => setSideLength(newValue as number)}
            aria-label='side length'
            valueLabelDisplay='auto'
          />
        </>
      )}

      {activeTool === 'Text' && (
        <>
          <Slider
            min={12}
            max={72}
            step={1}
            value={fontSize || 24}
            onChange={(event, newValue) => setFontSize(newValue as number)}
            aria-label='font size'
            valueLabelDisplay='auto'
          />
          <TextField
            label='Text content'
            variant='outlined'
            multiline
            maxRows={2}
            value={text || ''}
            onChange={(event) => setText(event.target.value)}
            sx={{ width: '100%' }}
          />
        </>
      )}

      {/* Hidden but always rendered to satisfy parent props */}
      <TextField
        type='hidden'
        value={String(selectedStroke)}
        onChange={() => {}}
      />
    </Box>
  );
};

export default ToolOptions;
