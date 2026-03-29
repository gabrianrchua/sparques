import { ContentCopy, Share } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';
import styles from './ShareModal.module.css';

interface ShareModalProps {
  link: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ShareModal = ({ link, open, setOpen }: ShareModalProps) => {
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Card className={styles.card}>
        <CardContent>
          <Typography variant='h4'>Share</Typography>
          <br />
          <Box display='flex' flexDirection='row' width='100%'>
            <Typography
              variant='body2'
              flexGrow={1}
              overflow='scroll'
              whiteSpace='nowrap'
            >
              {link}
            </Typography>
            <IconButton size='small'>
              <ContentCopy />
            </IconButton>
          </Box>
        </CardContent>
        <CardActions>
          <Button startIcon={<Share />}>Share via...</Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default ShareModal;
