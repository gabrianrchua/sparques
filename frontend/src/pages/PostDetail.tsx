import { Box, Card, CardActions, CardContent, IconButton, Skeleton, Typography } from "@mui/material";
import Post from "../interfaces/Post";
import { ArrowBack, Comment, KeyboardArrowDown, KeyboardArrowUp, Share } from "@mui/icons-material";
import UtilitiesService from "../services/Utilities";
import PillButton from "../components/pillbutton/PillButton";
import { Link, useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import NetworkService from "../services/Network";
import CommentDisplay from "../components/comment/CommentDisplay";
import CommentDetail from "../interfaces/CommentDetail";

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

  useEffect(() => {
    // only if this page became active
    if (postid && location.pathname === "/post/" + postid) {
      NetworkService.getPostDetail(postid).then(post => {
        setPost(post);
        console.log(post);
      });
    }
  }, [location.pathname]);

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
          <Typography variant="body2">
            {post.content}
          </Typography>
        </CardContent>
        <CardActions>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box sx={{ flexGrow: 1 }}>
              <PillButton variant="outlined" startIcon={<KeyboardArrowUp />} onClick={() => { console.log("upvote"); }}>
                <Typography variant="body2">{UtilitiesService.formatNumber(post.numUpvotes)}</Typography>
              </PillButton>
              <PillButton variant="outlined" startIcon={<KeyboardArrowDown />} onClick={() => { console.log("downvote"); }}>
                <Typography variant="body2">{UtilitiesService.formatNumber(post.numDownvotes)}</Typography>
              </PillButton>
              <PillButton variant="outlined" startIcon={<Comment />} onClick={() => { console.log("comment"); }}>
                <Typography variant="body2">{UtilitiesService.formatNumber(post.numComments)}</Typography>
              </PillButton>
            </Box>
            <PillButton variant="outlined" startIcon={<Share />} onClick={() => { console.log("share"); }}>
              <Typography variant="body2">Share</Typography>
            </PillButton>
          </Box>
        </CardActions>
      </Card>
      {post.comments && organizeComments(post.comments)}
    </>
  );
}