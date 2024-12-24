import { Box, Card, CardActions, CardContent, IconButton, Skeleton, Typography } from "@mui/material";
import Post from "../interfaces/Post";
import { Add, ArrowBack, Comment, KeyboardArrowDown, KeyboardArrowUp, Share } from "@mui/icons-material";
import UtilitiesService from "../services/Utilities";
import PillButton from "../components/pillbutton/PillButton";
import { Link, useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import NetworkService from "../services/Network";
import CommentDisplay from "../components/comment/CommentDisplay";
import CommentDetail from "../interfaces/CommentDetail";
import CommentEditor from "../components/comment/CommentEditor";
import { enqueueSnackbar } from "notistack";

// helper functions
function organizeComments(comments: CommentDetail[]): JSX.Element[] {
  // map to group comments by parentId
  const commentMap: Map<string | undefined, CommentDetail[]> = new Map();

  // populate map with keys
  for (const comment of comments) {
    const parentId = comment.parentId;

    if (!commentMap.has(parentId)) {
      commentMap.set(parentId, []);
    }
    commentMap.get(parentId)!.push(comment);
  }

  // recursive function to organize comments
  function buildCommentTree(parentId: string | undefined, depth: number): JSX.Element[] {
    const childComments = commentMap.get(parentId) || [];
    return childComments.flatMap(child => [
      <CommentDisplay key={child._id} comment={child} depth={depth} />,
      ...buildCommentTree(child._id, depth + 1),
    ]);
  }

  return buildCommentTree(undefined, 0);
}

export default function FeedPost() {
  const { postid } = useParams();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const location = useLocation();
  const [isCommentBoxShown, setIsCommentBoxShown] = useState(false);
  const [commentValue, setCommentValue] = useState("");

  useEffect(() => {
    // only if this page became active
    if (postid && location.pathname === "/post/" + postid) {
      refreshPostDetails();
    }
  }, [location.pathname]);

  function refreshPostDetails() {
    if (!postid) return;

    NetworkService.getPostDetail(postid).then(post => {
      setPost(post);
      console.log(post);
    });
  }

  function onCommentSubmit(value: string) {
    if (!postid) return;

    NetworkService.postComment(postid, value, undefined).then(_ => {
      enqueueSnackbar("Comment posted!");
      setCommentValue("");
      setIsCommentBoxShown(false);
      refreshPostDetails();
    }).catch(err => {
      enqueueSnackbar("Failed to post comment: " + err.response.data.message, { variant: "error" });
    });
  }

  function votePost(isUpvote: boolean) {
    if (!postid) return;

    NetworkService.postVotePost(postid, isUpvote).then(_ => {
      refreshPostDetails();
    }).catch(err => {
      enqueueSnackbar("Failed to vote: " + err.response.data.message, { variant: "error" });
    })
  }

  // if post hasn't loaded yet
  if (!post) {
    return (
      <>
        <Skeleton variant="rounded" height={100} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      </>
    );
  }

  return (
    <>
      <Card sx={{ marginBottom: '12px' }}>
        <CardContent>
          <Box sx={{ display: "flex" }}>
            <Link to="/" style={{ marginRight: "18px" }}>
              <IconButton size="small">
                <ArrowBack />
              </IconButton>
            </Link>
            <Typography gutterBottom variant="h5">{post.title}</Typography>
          </Box>
          <Typography variant="caption">c/{post.community} &bull; p/{post.author} &bull; {UtilitiesService.timeSince(new Date(post.editDate))}</Typography>
          <Typography variant="body2" component="pre">
            {post.content}
          </Typography>
        </CardContent>
        <CardActions>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box sx={{ flexGrow: 1 }}>
              <PillButton variant="outlined" startIcon={<KeyboardArrowUp />} onClick={() => votePost(true)}>
                <Typography variant="body2">{UtilitiesService.formatNumber(post.numUpvotes)}</Typography>
              </PillButton>
              <PillButton variant="outlined" startIcon={<KeyboardArrowDown />} onClick={() => votePost(false)}>
                <Typography variant="body2">{UtilitiesService.formatNumber(post.numDownvotes)}</Typography>
              </PillButton>
              <PillButton variant="outlined" startIcon={<Comment />} onClick={() => setIsCommentBoxShown(true)}>
                <Typography variant="body2">{UtilitiesService.formatNumber(post.numComments)}</Typography>
              </PillButton>
            </Box>
            <PillButton variant="outlined" startIcon={<Share />} onClick={() => { console.log("share"); }}>
              <Typography variant="body2">Share</Typography>
            </PillButton>
          </Box>
        </CardActions>
      </Card>
      <PillButton variant="outlined" startIcon={<Add />} onClick={() => setIsCommentBoxShown(true)} sx={{ marginBottom: "12px" }}>
        <Typography variant="body2">Add a comment</Typography>
      </PillButton>
      {isCommentBoxShown &&
        <Box sx={{ marginBottom: "12px", width: "100%" }}>
          <CommentEditor value={commentValue} setValue={setCommentValue} onSubmit={onCommentSubmit} />
        </Box>
      }
      {post.comments && organizeComments(post.comments)}
    </>
  );
}