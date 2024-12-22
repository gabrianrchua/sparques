import { KeyboardArrowUp, KeyboardArrowDown, Share } from "@mui/icons-material";
import { Card, CardContent, Typography, CardActions, Box } from "@mui/material";
import CommentDetail from "../../interfaces/CommentDetail";
import UtilitiesService from "../../services/Utilities";
import PillButton from "../pillbutton/PillButton";

export default function CommentDisplay(props: {comment: CommentDetail}) {
  return (
    <Card sx={{ marginBottom: '12px' }}>
      <CardContent>
        <Typography variant="caption">p/{props.comment.author} &bull; {UtilitiesService.timeSince(new Date(props.comment.editDate))}</Typography>
        <Typography variant="body2">
          {props.comment.content}
        </Typography>
      </CardContent>
      {/*<CardActions>
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
      </CardActions>*/}
    </Card>
  );
}