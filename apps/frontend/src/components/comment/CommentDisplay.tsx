import { Share, Comment } from '@mui/icons-material';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  Divider,
} from '@mui/material';
import { CommentDetail } from '@sparques/types';
import UtilitiesService from '../../services/Utilities';
import PillButton from '../pillbutton/PillButton';
import { useState } from 'react';
import CommentEditor from './CommentEditor';
import { useParams } from 'react-router';
import { enqueueSnackbar } from 'notistack';
import NetworkService from '../../services/Network';

const CommentDisplay = (props: {
  comment: CommentDetail;
  depth: number;
  refreshParentPost: () => void;
}) => {
  const [isCommentBoxShown, setIsCommentBoxShown] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const { postid } = useParams();

  const onCommentSubmit = (value: string) => {
    if (!postid) return;

    NetworkService.postComment(postid, value, props.comment._id)
      .then((_) => {
        enqueueSnackbar('Comment posted!');
        setCommentValue('');
        setIsCommentBoxShown(false);
        props.refreshParentPost();
      })
      .catch((err) => {
        enqueueSnackbar(
          'Failed to post comment: ' + err.response.data.message,
          { variant: 'error' }
        );
      });
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {Array.from({ length: props.depth }, (_, index) => (
        <Divider
          orientation='vertical'
          flexItem
          key={index}
          sx={{ marginRight: '30px' }}
        />
      ))}
      <Card sx={{ marginBottom: '12px', flexGrow: 1 }}>
        <CardContent>
          <Typography variant='caption'>
            p/{props.comment.author} &bull;{' '}
            {UtilitiesService.timeSince(new Date(props.comment.editDate))}
          </Typography>
          <Typography
            variant='body2'
            component='pre'
            sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
          >
            {props.comment.content}
          </Typography>
        </CardContent>
        <CardActions>
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              {/*<PillButton variant="outlined" startIcon={<KeyboardArrowUp />} onClick={() => { console.log("upvote"); }}>
                <Typography variant="body2">{UtilitiesService.formatNumber(post.numUpvotes)}</Typography>
              </PillButton>
              <PillButton variant="outlined" startIcon={<KeyboardArrowDown />} onClick={() => { console.log("downvote"); }}>
                <Typography variant="body2">{UtilitiesService.formatNumber(post.numDownvotes)}</Typography>
              </PillButton>*/}
              <PillButton
                variant='outlined'
                startIcon={<Comment />}
                onClick={() => setIsCommentBoxShown(true)}
              >
                <Typography variant='body2'>Reply</Typography>
              </PillButton>
            </Box>
            <PillButton
              variant='outlined'
              startIcon={<Share />}
              onClick={() => {
                console.log('share');
              }}
            >
              <Typography variant='body2'>Share</Typography>
            </PillButton>
          </Box>
        </CardActions>
      </Card>
      {isCommentBoxShown && (
        <Box sx={{ marginBottom: '12px', width: '100%' }}>
          <CommentEditor
            value={commentValue}
            setValue={setCommentValue}
            onSubmit={onCommentSubmit}
            submitText='Reply'
          />
        </Box>
      )}
    </Box>
  );
};

export default CommentDisplay;
