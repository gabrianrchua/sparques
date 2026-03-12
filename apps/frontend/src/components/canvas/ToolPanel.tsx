import {
  Brush,
  Circle,
  FormatColorFill,
  Pentagon,
  Rectangle,
  TextFields,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';

const ToolPanel = () => {
  return (
    <Box paddingBottom='12px' gap='6px' display='flex'>
      <Button variant='outlined' startIcon={<Brush />}>
        Brush
      </Button>
      <Button variant='outlined' startIcon={<Circle />}>
        Circle
      </Button>
      <Button variant='outlined' startIcon={<Rectangle />}>
        Rectangle
      </Button>
      <Button variant='outlined' startIcon={<Pentagon />}>
        Polygon
      </Button>
      <Button variant='outlined' startIcon={<TextFields />}>
        Text
      </Button>
      <Button variant='outlined' startIcon={<FormatColorFill />}>
        Fill
      </Button>
    </Box>
  );
};

export default ToolPanel;
