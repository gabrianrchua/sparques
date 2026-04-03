import {
  Share,
  Comment,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  Divider,
  useTheme,
  Skeleton,
} from '@mui/material';
import { CommentNode } from '@sparques/types';
import UtilitiesService from '../../services/Utilities';
import PillButton from '../pillbutton/PillButton';
import { useState } from 'react';
import CommentEditor from './CommentEditor';
import { enqueueSnackbar } from 'notistack';
import NetworkService from '../../services/Network';
import styles from './CommentDisplay.module.css';

interface CommentDisplayProps {
  comment: CommentNode;
  refreshParentComments: () => void;
}

const CommentDisplay = ({
  comment,
  refreshParentComments,
}: CommentDisplayProps) => {
  const [isCommentBoxShown, setIsCommentBoxShown] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [replies, setReplies] = useState<CommentNode[]>([]);
  const [nextRepliesCursor, setNextRepliesCursor] = useState<string | null>(
    null
  );
  const [areRepliesVisible, setAreRepliesVisible] = useState(false);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);
  const theme = useTheme();

  const loadReplies = (cursor?: string) => {
    setIsRepliesLoading(true);
    NetworkService.getCommentReplies(comment._id, cursor)
      .then((page) => {
        setReplies((currentReplies) =>
          cursor ? [...currentReplies, ...page.items] : page.items
        );
        setNextRepliesCursor(page.nextCursor);
      })
      .finally(() => {
        setIsRepliesLoading(false);
      });
  };

  const toggleReplies = () => {
    if (areRepliesVisible) {
      setAreRepliesVisible(false);
      return;
    }

    setAreRepliesVisible(true);
    loadReplies();
  };

  const onCommentSubmit = (value: string) => {
    NetworkService.postReply(comment._id, value)
      .then((_) => {
        enqueueSnackbar('Comment posted!');
        setCommentValue('');
        setIsCommentBoxShown(false);
        setAreRepliesVisible(true);
        loadReplies();
      })
      .catch((err) => {
        enqueueSnackbar(
          'Failed to post comment: ' + err.response.data.message,
          { variant: 'error' }
        );
      });
  };

  const voteComment = (isUpvote: boolean) => {
    NetworkService.postVoteComment(comment._id, isUpvote)
      .then((_) => {
        refreshParentComments();
        if (areRepliesVisible) {
          loadReplies();
        }
      })
      .catch((err) => {
        enqueueSnackbar('Failed to vote: ' + err.response.data.message, {
          variant: 'error',
        });
      });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', width: '100%', alignItems: 'stretch' }}>
        {Array.from({ length: comment.depth }, (_, index) => (
          <Divider
            orientation='vertical'
            flexItem
            key={index}
            sx={{ marginRight: '30px', alignSelf: 'stretch' }}
          />
        ))}
        <Card sx={{ marginBottom: '12px', flexGrow: 1 }}>
          <CardContent>
            <Typography variant='caption'>
              p/{comment.author} &bull;{' '}
              {UtilitiesService.timeSince(new Date(comment.editDate))}
            </Typography>
            <Typography
              variant='body2'
              component='pre'
              sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            >
              {comment.content}
            </Typography>
          </CardContent>
          <CardActions>
            <Box sx={{ display: 'flex', width: '100%' }}>
              <Box sx={{ flexGrow: 1 }}>
                <PillButton
                  variant='outlined'
                  startIcon={<KeyboardArrowUp />}
                  onClick={() => voteComment(true)}
                  sx={
                    comment.viewerVote === 'up'
                      ? { backgroundColor: theme.palette.primary.dark }
                      : undefined
                  }
                >
                  <Typography variant='body2'>
                    {UtilitiesService.formatNumber(comment.numUpvotes)}
                  </Typography>
                </PillButton>
                <PillButton
                  variant='outlined'
                  startIcon={<KeyboardArrowDown />}
                  onClick={() => voteComment(false)}
                  sx={
                    comment.viewerVote === 'down'
                      ? { backgroundColor: theme.palette.error.dark }
                      : undefined
                  }
                >
                  <Typography variant='body2'>
                    {UtilitiesService.formatNumber(comment.numDownvotes)}
                  </Typography>
                </PillButton>
                <PillButton
                  variant='outlined'
                  startIcon={<Comment />}
                  onClick={() => setIsCommentBoxShown(true)}
                >
                  <Typography variant='body2'>Reply</Typography>
                </PillButton>
                {comment.replyCount > 0 && (
                  <PillButton variant='outlined' onClick={toggleReplies}>
                    <Typography variant='body2'>
                      {areRepliesVisible ? 'Hide replies' : 'Show replies'} (
                      {UtilitiesService.formatNumber(comment.replyCount)})
                    </Typography>
                  </PillButton>
                )}
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
      </Box>
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
      {areRepliesVisible &&
        replies.map((reply) => (
          <CommentDisplay
            key={reply._id}
            comment={reply}
            refreshParentComments={() => loadReplies()}
          />
        ))}
      {areRepliesVisible && isRepliesLoading && (
        <>
          <Skeleton variant='rounded' className={styles.replySkeleton} />
          <Skeleton variant='rounded' className={styles.replySkeleton} />
          <Skeleton variant='rounded' className={styles.replySkeleton} />
        </>
      )}
      {areRepliesVisible && nextRepliesCursor && (
        <Box sx={{ marginBottom: '12px', width: '100%' }}>
          <PillButton
            variant='outlined'
            onClick={() => loadReplies(nextRepliesCursor)}
          >
            <Typography variant='body2'>Load more replies</Typography>
          </PillButton>
        </Box>
      )}
    </Box>
  );
};

export default CommentDisplay;
