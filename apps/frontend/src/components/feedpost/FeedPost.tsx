import { Box, Card, CardActionArea, CardActions, CardContent, Typography, useTheme } from "@mui/material";
import Post from "../../interfaces/Post";
import { Comment, KeyboardArrowDown, KeyboardArrowUp, Share } from "@mui/icons-material";
import styles from "./FeedPost.module.css";
import UtilitiesService from "../../services/Utilities";
import PillButton from "../pillbutton/PillButton";
import { useNavigate } from "react-router";
import NetworkService from "../../services/Network";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

export default function FeedPost(props: { post: Post }) {
  const navigate = useNavigate();
  const [post, setPost] = useState<Post>(props.post);
  const theme = useTheme();
  
  function navigateToPost() {
    navigate("/post/" + props.post._id);
  }
  
  // run whenever props.post changes
  useEffect(() => {
    setPost(props.post);
  }, [props.post])

  function votePost(postid: string, isUpvote: boolean) {
    NetworkService.postVotePost(postid, isUpvote).then(_ => {
      // refresh only this post
      NetworkService.getPostDetail(postid).then(post => {
        setPost(post);
      }).catch(err => {
        console.error(err);
        enqueueSnackbar("Failed refresh post details: " + err.response.data.message, { variant: "error" });
      })
    }).catch(err => {
      enqueueSnackbar("Failed to vote: " + err.response.data.message, { variant: "error" });
    })
  }

  return (
    <Card sx={{ marginBottom: '12px' }}>
      <CardActionArea onClick={navigateToPost}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {post.title}
          </Typography>
          <Typography variant="caption">c/{post.community} &bull; p/{post.author} &bull; {UtilitiesService.timeSince(new Date(post.editDate))}</Typography>
          <Typography variant="body2" component="pre" className={styles.contentText}>
            {post.content}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Box sx={{ display: "flex", width: "100%" }}>
          <Box sx={{ flexGrow: 1 }}>
            {post.votes && post.votes[0] && post.votes[0].isUpvote ? (
                <PillButton
                  variant="outlined"
                  startIcon={<KeyboardArrowUp />}
                  onClick={() => votePost(post._id, true)}
                  sx={{ backgroundColor: theme.palette.primary.dark }}
                >
                  <Typography variant="body2">{UtilitiesService.formatNumber(post.numUpvotes)}</Typography>
                </PillButton>
              ) : (
                <PillButton
                  variant="outlined"
                  startIcon={<KeyboardArrowUp />}
                  onClick={() => votePost(post._id, true)}
                >
                  <Typography variant="body2">{UtilitiesService.formatNumber(post.numUpvotes)}</Typography>
                </PillButton>
              )}
              {post.votes && post.votes[0] && !post.votes[0].isUpvote ? (
                <PillButton
                  variant="outlined"
                  startIcon={<KeyboardArrowDown />}
                  onClick={() => votePost(post._id, false)}
                  sx={{ backgroundColor: theme.palette.error.dark }}
                >
                  <Typography variant="body2">{UtilitiesService.formatNumber(post.numDownvotes)}</Typography>
                </PillButton>
              ) : (
                <PillButton
                  variant="outlined"
                  startIcon={<KeyboardArrowDown />}
                  onClick={() => votePost(post._id, false)}
                >
                  <Typography variant="body2">{UtilitiesService.formatNumber(post.numDownvotes)}</Typography>
                </PillButton>
              )}
            <PillButton variant="outlined" startIcon={<Comment />} onClick={navigateToPost}>
              <Typography variant="body2">{UtilitiesService.formatNumber(post.numComments)}</Typography>
            </PillButton>
          </Box>
          <PillButton variant="outlined" startIcon={<Share />} onClick={() => { console.log("share"); }}>
            <Typography variant="body2">Share</Typography>
          </PillButton>
        </Box>
      </CardActions>
    </Card>
  );
}