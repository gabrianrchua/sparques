import {
  handleKeyDown,
  shortcuts,
  TextAreaCommandOrchestrator,
  getCommands,
  commands,
  ICommand,
} from '@uiw/react-md-editor';
import { useEffect, useRef } from 'react';
import styles from './MarkdownEditor.module.css';
import { Box, IconButton } from '@mui/material';
import { FormatBold, FormatItalic } from '@mui/icons-material';

interface MarkdownEditorProps {
  value: string;
  setValue: (value: string) => void;
}

const MarkdownEditor = ({ value, setValue }: MarkdownEditorProps) => {
  const textareaRef = useRef(null);
  const orchestratorRef = useRef<TextAreaCommandOrchestrator | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      orchestratorRef.current = new TextAreaCommandOrchestrator(
        textareaRef.current
      );
    }
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(event, 2, false);
    if (orchestratorRef.current) {
      shortcuts(event, getCommands(), orchestratorRef.current);
    }
  };

  const dispatchCommand = (command: ICommand<string>) => {
    if (orchestratorRef.current) {
      orchestratorRef.current.executeCommand(command);
    } else {
      console.error(
        'Unable to dispatch markdown command, orchestratorRef was null!'
      );
    }
  };

  return (
    <>
      <Box display='flex' flexDirection='row'>
        <IconButton size='small' onClick={() => dispatchCommand(commands.bold)}>
          <FormatBold />
        </IconButton>
        <IconButton
          size='small'
          onClick={() => dispatchCommand(commands.italic)}
        >
          <FormatItalic />
        </IconButton>
      </Box>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className={styles.editorTextarea}
        onKeyDown={onKeyDown}
      />
    </>
  );
};

export default MarkdownEditor;
