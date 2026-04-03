import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownTypographyProps {
  text: string;
}

const MarkdownTypography = ({ text }: MarkdownTypographyProps) => {
  return <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>;
};

export default MarkdownTypography;
