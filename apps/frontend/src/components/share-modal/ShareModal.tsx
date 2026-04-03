import { Close, ContentCopy, Share } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Modal,
  Paper,
  Typography,
} from '@mui/material';
import styles from './ShareModal.module.css';
import { enqueueSnackbar } from 'notistack';

interface ShareModalProps {
  link: string;
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    enqueueSnackbar('Copied to clipboard!');
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

const isWebShareAvailable = (): boolean => {
  return Boolean(navigator.share);
};

const webShare = async (
  title: string,
  text: string,
  url: string
): Promise<void> => {
  if (isWebShareAvailable()) {
    await navigator.share({
      title,
      text,
      url,
    });
  } else {
    // should not happen, but if it does, fall back to plain copy
    copyToClipboard(url);
  }
};

const ShareModal = ({ link, title, open, setOpen }: ShareModalProps) => {
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Card className={styles.card}>
        <CardHeader
          title='Share'
          action={
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          }
        />
        <CardContent>
          <Paper elevation={3} sx={{ padding: '8px' }}>
            <Box
              display='flex'
              flexDirection='row'
              width='100%'
              alignItems='center'
            >
              <Typography
                variant='body2'
                flexGrow={1}
                overflow='scroll'
                whiteSpace='nowrap'
              >
                {link}
              </Typography>
              <IconButton size='small' onClick={() => copyToClipboard(link)}>
                <ContentCopy />
              </IconButton>
            </Box>
          </Paper>
        </CardContent>
        {isWebShareAvailable() && (
          <CardActions>
            <Button
              startIcon={<Share />}
              onClick={() =>
                webShare(title, 'Check this out on Sparques!', link)
              }
            >
              Share via...
            </Button>
          </CardActions>
        )}
      </Card>
    </Modal>
  );
};

export default ShareModal;
