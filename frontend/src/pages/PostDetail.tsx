import { Box, Card, CardActionArea, CardActions, CardContent, Skeleton, Typography } from "@mui/material";
import Post from "../interfaces/Post";
import { Comment, KeyboardArrowDown, KeyboardArrowUp, PropaneSharp, Share } from "@mui/icons-material";
//import styles from "./FeedPost.module.css";
import UtilitiesService from "../services/Utilities";
import PillButton from "../components/pillbutton/PillButton";
import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import NetworkService from "../services/Network";
import CommentDisplay from "../components/comment/CommentDisplay";

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

  return post ?
  (
    <>
      <Card sx={{ marginBottom: '12px' }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {post.title}
          </Typography>
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
      {post.comments && post.comments.map((comment, index) => 
        <CommentDisplay comment={comment} key={index} />
      )}
    </>
  ) : (
    <>
      <Skeleton variant="rounded" />
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
    </>
  );
}