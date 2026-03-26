import { Card, CardContent, Typography } from '@mui/material';

interface NothingFoundProps {
  content?: string;
}

const NothingFound = ({ content }: NothingFoundProps) => {
  return (
    <Card>
      <CardContent sx={{ paddingTop: '24px' }}>
        <Typography variant='body1' textAlign='center'>
          {content ?? 'Nothing here but crickets!'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NothingFound;
