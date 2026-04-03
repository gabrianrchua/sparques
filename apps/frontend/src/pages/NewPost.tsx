import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import NetworkService from '../services/Network';
import { enqueueSnackbar } from 'notistack';
import { Community } from '@sparques/types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Markdown from 'react-markdown';
import MarkdownEditor from '../components/markdown-editor/MarkdownEditor';

// create a new post
const NewPost = () => {
  const [community, setCommunity] = useState<string>('main');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [editorTab, setEditorTab] = useState<number>(0);
  const [communities, setCommunities] = useState<Community[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // only if this page became active
    if (location.pathname === '/newpost') {
      NetworkService.getCommunities().then((result) => {
        setCommunities(result);
        console.log('Get community list', result);
      });
    }
  }, [location.pathname]);

  const onSubmit = () => {
    if (!title || !content || !community) return;
    NetworkService.postNewPost(title, content, community)
      .then((result) => {
        enqueueSnackbar('Post created!');
        navigate('/post/' + result._id);
      })
      .catch((err) => {
        enqueueSnackbar('Failed to post: ' + err.response.data.message, {
          variant: 'error',
        });
      });
  };

  return communities.length > 0 ? (
    <>
      <Typography variant='h4' sx={{ marginBottom: '18px' }}>
        New Post
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: '12px' }}>
        <InputLabel>Community</InputLabel>
        <Select
          value={community}
          label='Community'
          onChange={(event) => setCommunity(event.target.value)}
        >
          {communities.map((value) => (
            <MenuItem value={value.title} key={value.title}>
              c/{value.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label='Title'
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        size='small'
        sx={{ marginBottom: '12px' }}
        fullWidth
      />
      <br />
      <Tabs
        value={editorTab}
        onChange={(_, newValue) => setEditorTab(newValue)}
      >
        <Tab label='Editor' id='0-editor' />
        <Tab label='Both' id='1-sidebyside' />
        <Tab label='Preview' id='2-preview' />
      </Tabs>
      <Box display='flex' flexDirection='row' width='100%'>
        {editorTab !== 2 && (
          /*<MDEditor
            value={content}
            onChange={(value) => setContent(value ?? '')}
          />*/
          <Box width={editorTab === 1 ? '50%' : '100%'}>
            <MarkdownEditor
              value={content}
              setValue={(value) => setContent(value)}
            />
          </Box>
        )}
        {editorTab !== 0 && (
          <Box
            height={400}
            border='1px solid grey'
            borderRadius='4px'
            padding='8px'
            width={editorTab === 1 ? '50%' : '100%'}
            marginTop={editorTab === 1 ? '34px' : 0}
            overflow='scroll'
          >
            <Markdown>{content}</Markdown>
          </Box>
        )}
      </Box>
      {/*<TextField
        value={content}
        onChange={(event) => setContent(event.target.value)}
        multiline
        minRows={6}
        sx={{ marginBottom: '12px' }}
        fullWidth
      />*/}
      <br />
      <Button
        variant='contained'
        sx={{ marginRight: '12px' }}
        onClick={onSubmit}
        disabled={!content || !title || !community}
      >
        Post
      </Button>
      <Button variant='outlined' color='info' onClick={() => navigate(-1)}>
        Discard
      </Button>
    </>
  ) : (
    <>
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
    </>
  );
};

export default NewPost;
