import { Box, Button, ButtonProps, Card, CardActionArea, CardActions, CardContent, styled, Typography } from "@mui/material";
import Post from "../../interfaces/Post";
import { Comment, KeyboardArrowDown, KeyboardArrowUp, Share } from "@mui/icons-material";
//import styles from "./FeedPost.module.css";
import UtilitiesService from "../../services/Utilities";
import PillButton from "../pillbutton/PillButton";
import { useNavigate } from "react-router";

export default function FeedPost(props: { post: Post }) {
  const navigate = useNavigate();
  
  function navigateToPost() {
    navigate("/post/" + props.post._id);
  }

  return (
    <Card sx={{ marginBottom: '12px' }}>
      <CardActionArea onClick={navigateToPost}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.post.title}
          </Typography>
          <Typography variant="caption">c/{props.post.community} &bull; p/{props.post.author} &bull; {UtilitiesService.timeSince(new Date(props.post.editDate))}</Typography>
          <Typography variant="body2">
            {props.post.content}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Box sx={{ display: "flex", width: "100%" }}>
          <Box sx={{ flexGrow: 1 }}>
            <PillButton variant="outlined" startIcon={<KeyboardArrowUp />} onClick={() => { console.log("upvote"); }}>
              <Typography variant="body2">{UtilitiesService.formatNumber(props.post.numUpvotes)}</Typography>
            </PillButton>
            <PillButton variant="outlined" startIcon={<KeyboardArrowDown />} onClick={() => { console.log("downvote"); }}>
              <Typography variant="body2">{UtilitiesService.formatNumber(props.post.numDownvotes)}</Typography>
            </PillButton>
            <PillButton variant="outlined" startIcon={<Comment />} onClick={navigateToPost}>
              <Typography variant="body2">{UtilitiesService.formatNumber(props.post.numComments)}</Typography>
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