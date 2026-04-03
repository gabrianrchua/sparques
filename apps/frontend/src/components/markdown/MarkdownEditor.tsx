import {
  handleKeyDown,
  shortcuts,
  TextAreaCommandOrchestrator,
  getCommands,
  commands,
  ICommand,
} from '@uiw/react-md-editor';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import styles from './MarkdownEditor.module.css';
import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import {
  CheckBox,
  Code,
  DataObject,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Image,
  Link,
  StrikethroughS,
  TableChart,
  Title,
} from '@mui/icons-material';

interface MarkdownEditorProps {
  value: string;
  setValue: (value: string) => void;
}

const MarkdownEditor = ({ value, setValue }: MarkdownEditorProps) => {
  const textareaRef = useRef(null);
  const orchestratorRef = useRef<TextAreaCommandOrchestrator | null>(null);
  const [headingMenuAnchor, setHeadingMenuAnchor] =
    useState<HTMLElement | null>(null);

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

  const openHeadingMenu = (event: MouseEvent<HTMLElement>) => {
    setHeadingMenuAnchor(event.currentTarget);
  };

  const closeHeadingMenu = () => {
    setHeadingMenuAnchor(null);
  };

  const selectHeading = (command: ICommand<string>) => {
    dispatchCommand(command);
    closeHeadingMenu();
  };

  return (
    <>
      <Box display='flex' flexDirection='row'>
        <Tooltip title='Bold'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.bold)}
          >
            <FormatBold />
          </IconButton>
        </Tooltip>
        <Tooltip title='Italics'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.italic)}
          >
            <FormatItalic />
          </IconButton>
        </Tooltip>
        <Tooltip title='Strikethrough'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.strikethrough)}
          >
            <StrikethroughS />
          </IconButton>
        </Tooltip>
        <Tooltip title='Headings'>
          <IconButton size='small' onClick={openHeadingMenu}>
            <Title />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={headingMenuAnchor}
          open={Boolean(headingMenuAnchor)}
          onClose={closeHeadingMenu}
        >
          <MenuItem onClick={() => selectHeading(commands.heading1)}>
            Heading 1
          </MenuItem>
          <MenuItem onClick={() => selectHeading(commands.heading2)}>
            Heading 2
          </MenuItem>
          <MenuItem onClick={() => selectHeading(commands.heading3)}>
            Heading 3
          </MenuItem>
          <MenuItem onClick={() => selectHeading(commands.heading4)}>
            Heading 4
          </MenuItem>
          <MenuItem onClick={() => selectHeading(commands.heading5)}>
            Heading 5
          </MenuItem>
          <MenuItem onClick={() => selectHeading(commands.heading6)}>
            Heading 6
          </MenuItem>
        </Menu>
        <Tooltip title='Link'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.link)}
          >
            <Link />
          </IconButton>
        </Tooltip>
        <Tooltip title='Quote'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.quote)}
          >
            <FormatQuote />
          </IconButton>
        </Tooltip>
        <Tooltip title='Inline code'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.code)}
          >
            <Code />
          </IconButton>
        </Tooltip>
        <Tooltip title='Code block'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.codeBlock)}
          >
            <DataObject />
          </IconButton>
        </Tooltip>
        <Tooltip title='Image'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.image)}
          >
            <Image />
          </IconButton>
        </Tooltip>
        <Tooltip title='Table'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.table)}
          >
            <TableChart />
          </IconButton>
        </Tooltip>
        <Tooltip title='Unordered list'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.unorderedListCommand)}
          >
            <FormatListBulleted />
          </IconButton>
        </Tooltip>
        <Tooltip title='Ordered list'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.orderedListCommand)}
          >
            <FormatListNumbered />
          </IconButton>
        </Tooltip>
        <Tooltip title='Check boxes'>
          <IconButton
            size='small'
            onClick={() => dispatchCommand(commands.checkedListCommand)}
          >
            <CheckBox />
          </IconButton>
        </Tooltip>
      </Box>
      <textarea
        name='Content editor'
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
