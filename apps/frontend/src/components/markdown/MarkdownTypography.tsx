import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownTypography.module.css';
import { Box } from '@mui/material';

interface MarkdownTypographyProps {
  text: string;
}

const MarkdownTypography = ({ text }: MarkdownTypographyProps) => {
  return (
    <Box className={styles.markdownWrapper}>
      <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
    </Box>
  );
};

export default MarkdownTypography;
