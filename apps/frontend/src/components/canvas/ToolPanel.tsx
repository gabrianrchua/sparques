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
import { useState } from 'react';

const ToolPanel = () => {
  const [selectedStroke, setSelectedStroke] = useState<StrokeType | null>(null);

  return (
    <Box paddingBottom='12px' gap='6px' display='flex'>
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
          setSelectedStroke(selectedStroke === 'Rectangle' ? null : 'Rectangle')
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
  );
};

export default ToolPanel;
