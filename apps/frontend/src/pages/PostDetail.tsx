import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import { Post, CommentNode } from '@sparques/types';
import {
  Add,
  ArrowBack,
  Comment,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Share,
} from '@mui/icons-material';
import UtilitiesService from '../services/Utilities';
import PillButton from '../components/pillbutton/PillButton';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import NetworkService from '../services/Network';
import CommentDisplay from '../components/comment/CommentDisplay';
import CommentEditor from '../components/comment/CommentEditor';
import { enqueueSnackbar } from 'notistack';
import ShareModal from '../components/share-modal/ShareModal';
import MarkdownTypography from '../components/markdown/MarkdownTypography';

const PostDetail = () => {
  const { postid } = useParams();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [nextCommentsCursor, setNextCommentsCursor] = useState<string | null>(
    null
  );
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const location = useLocation();
  const [isCommentBoxShown, setIsCommentBoxShown] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // only if this page became active
    if (postid && location.pathname === '/post/' + postid) {
      refreshPostDetails(true);
    }
  }, [location.pathname]);

  const refreshPostDetails = (resetComments = false) => {
    if (!postid) return;

    NetworkService.getPostDetail(postid).then((post) => {
      setPost(post);
    });

    if (resetComments) {
      refreshTopLevelComments();
    }
  };

  const refreshTopLevelComments = () => {
    if (!postid) return;

    setIsCommentsLoading(true);
    NetworkService.getPostComments(postid)
      .then((page) => {
        setComments(page.items);
        setNextCommentsCursor(page.nextCursor);
      })
      .finally(() => {
        setIsCommentsLoading(false);
      });
  };

  const loadMoreTopLevelComments = () => {
    if (!postid || !nextCommentsCursor) return;

    setIsCommentsLoading(true);
    NetworkService.getPostComments(postid, nextCommentsCursor)
      .then((page) => {
        setComments((currentComments) => [...currentComments, ...page.items]);
        setNextCommentsCursor(page.nextCursor);
      })
      .finally(() => {
        setIsCommentsLoading(false);
      });
  };

  const onCommentSubmit = (value: string) => {
    if (!postid) return;

    NetworkService.postComment(postid, value)
      .then((_) => {
        enqueueSnackbar('Comment posted!');
        setCommentValue('');
        setIsCommentBoxShown(false);
        refreshPostDetails(true);
      })
      .catch((err) => {
        enqueueSnackbar(
          'Failed to post comment: ' + err.response.data.message,
          { variant: 'error' }
        );
      });
  };

  const votePost = (isUpvote: boolean) => {
    if (!postid) return;

    NetworkService.postVotePost(postid, isUpvote)
      .then((_) => {
        refreshPostDetails(false);
      })
      .catch((err) => {
        enqueueSnackbar('Failed to vote: ' + err.response.data.message, {
          variant: 'error',
        });
      });
  };

  const handleBack = () => {
    // TODO: save previous community viewed and then navigate there
    navigate('/');
  };

  const shareLink =
    typeof window === 'undefined'
      ? `/post/${post?._id ?? postid ?? ''}`
      : new URL(`/post/${post?._id ?? postid ?? ''}`, window.location.origin)
          .href;

  // if post hasn't loaded yet
  if (!post) {
    return (
      <>
        <Skeleton variant='rounded' height={100} />
        <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
        <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
        <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
      </>
    );
  }

  return (
    <>
      <Card sx={{ marginBottom: '12px' }}>
        <CardContent>
          <Box sx={{ display: 'flex' }}>
            <IconButton
              size='small'
              sx={{ marginRight: '18px' }}
              onClick={handleBack}
            >
              <ArrowBack />
            </IconButton>
            <Typography gutterBottom variant='h5'>
              {post.title}
            </Typography>
          </Box>
          <Typography variant='caption'>
            c/{post.community} &bull; p/{post.author} &bull;{' '}
            {UtilitiesService.timeSince(new Date(post.editDate))}
          </Typography>
          <MarkdownTypography text={post.content} />
          {/* TODO: remove this commented code
          <Typography
            variant='body2'
            component='pre'
            sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
          >
            {post.content}
          </Typography>*/}
        </CardContent>
        <CardActions>
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              {post.votes && post.votes[0] && post.votes[0].isUpvote ? (
                <PillButton
                  variant='outlined'
                  startIcon={<KeyboardArrowUp />}
                  onClick={() => votePost(true)}
                  sx={{ backgroundColor: theme.palette.primary.dark }}
                >
                  <Typography variant='body2'>
                    {UtilitiesService.formatNumber(post.numUpvotes)}
                  </Typography>
                </PillButton>
              ) : (
                <PillButton
                  variant='outlined'
                  startIcon={<KeyboardArrowUp />}
                  onClick={() => votePost(true)}
                >
                  <Typography variant='body2'>
                    {UtilitiesService.formatNumber(post.numUpvotes)}
                  </Typography>
                </PillButton>
              )}
              {post.votes && post.votes[0] && !post.votes[0].isUpvote ? (
                <PillButton
                  variant='outlined'
                  startIcon={<KeyboardArrowDown />}
                  onClick={() => votePost(false)}
                  sx={{ backgroundColor: theme.palette.error.dark }}
                >
                  <Typography variant='body2'>
                    {UtilitiesService.formatNumber(post.numDownvotes)}
                  </Typography>
                </PillButton>
              ) : (
                <PillButton
                  variant='outlined'
                  startIcon={<KeyboardArrowDown />}
                  onClick={() => votePost(false)}
                >
                  <Typography variant='body2'>
                    {UtilitiesService.formatNumber(post.numDownvotes)}
                  </Typography>
                </PillButton>
              )}
              <PillButton
                variant='outlined'
                startIcon={<Comment />}
                onClick={() => setIsCommentBoxShown(true)}
              >
                <Typography variant='body2'>
                  {UtilitiesService.formatNumber(post.numComments)}
                </Typography>
              </PillButton>
            </Box>
            <PillButton
              variant='outlined'
              startIcon={<Share />}
              onClick={() => {
                setIsShareModalOpen(true);
              }}
            >
              <Typography variant='body2'>Share</Typography>
            </PillButton>
          </Box>
        </CardActions>
      </Card>
      <ShareModal
        link={shareLink}
        title={`Sparques - ${post.title}`}
        open={isShareModalOpen}
        setOpen={setIsShareModalOpen}
      />
      <PillButton
        variant='outlined'
        startIcon={<Add />}
        onClick={() => setIsCommentBoxShown(true)}
        sx={{ marginBottom: '12px' }}
      >
        <Typography variant='body2'>Add a comment</Typography>
      </PillButton>
      {isCommentBoxShown && (
        <Box sx={{ marginBottom: '12px', width: '100%' }}>
          <CommentEditor
            value={commentValue}
            setValue={setCommentValue}
            onSubmit={onCommentSubmit}
          />
        </Box>
      )}
      {comments.map((comment) => (
        <CommentDisplay
          key={comment._id}
          comment={comment}
          refreshParentComments={refreshTopLevelComments}
        />
      ))}
      {isCommentsLoading && <Skeleton variant='rounded' height={72} />}
      {nextCommentsCursor && (
        <PillButton variant='outlined' onClick={loadMoreTopLevelComments}>
          <Typography variant='body2'>Load more comments</Typography>
        </PillButton>
      )}
    </>
  );
};

export default PostDetail;
