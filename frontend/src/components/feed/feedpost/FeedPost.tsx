import { Box, Button, ButtonProps, Card, CardActionArea, CardActions, CardContent, styled, Typography } from "@mui/material";
import Post from "../../../interfaces/Post";
import { Comment, KeyboardArrowDown, KeyboardArrowUp, Share } from "@mui/icons-material";
import styles from "./FeedPost.module.css";
import UtilitiesService from "../../../services/Utilities";

const PillButton = styled(Button)<ButtonProps>(() => ({
  color: "white",
  backgroundColor: "#00000",
  '&:hover': {
    backgroundColor: "#333333",
  },
  border: "1px solid #808080",
  borderRadius: "30px",
  height: "36px",
  marginRight: "10px",
}));

export default function FeedPost(props: { post: Post }) {
  return (
    <Card sx={{ marginBottom: '12px' }}>
      <CardActionArea onClick={() => { console.log("clicked post"); }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.post.title}
          </Typography>
          <Typography variant="caption">c/{props.post.community} &bull; p/{props.post.author} &bull; {UtilitiesService.timeSince(props.post.editDate)}</Typography>
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
            <PillButton variant="outlined" startIcon={<Comment />} onClick={() => { console.log("comment"); }}>
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