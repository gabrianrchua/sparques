import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import Post from "../../../interfaces/Post";

export default function FeedPost(props: { post: Post }) {
  return (
    <Card sx={{ marginBottom: '12px' }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.post.title}
          </Typography>
          <Typography variant="body2">
            {props.post.content}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}