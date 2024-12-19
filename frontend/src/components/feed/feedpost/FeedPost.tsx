import { Box, Button, ButtonProps, Card, CardActionArea, CardActions, CardContent, IconButton, styled, Typography } from "@mui/material";
import Post from "../../../interfaces/Post";
import { Comment, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import styles from "./FeedPost.module.css";

const CommentButton = styled(Button)<ButtonProps>(() => ({
  color: "white",
  backgroundColor: "#00000",
  '&:hover': {
    backgroundColor: "#333333",
  },
  border: "1px solid #808080",
  borderRadius: "30px",
  height: "36px"
}));

export default function FeedPost(props: { post: Post }) {
  return (
    <Card sx={{ marginBottom: '12px' }}>
      <CardActionArea onClick={() => { console.log("clicked post"); }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.post.title}
          </Typography>
          <Typography variant="body2">
            {props.post.content}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Box className={styles.scoreBox}>
          <IconButton size="small" onClick={() => { console.log("upvote"); }}>
            <KeyboardArrowUp />
          </IconButton>
          <Typography variant="body2" sx={{ alignContent: "center" }}>123</Typography>
          <IconButton size="small" onClick={() => { console.log("downvote"); }}>
            <KeyboardArrowDown />
          </IconButton>
        </Box>
        <CommentButton variant="outlined" startIcon={<Comment />} onClick={() => { console.log("comment"); }}>
          <Typography variant="body2">123</Typography>
        </CommentButton>
      </CardActions>
    </Card>
  );
}