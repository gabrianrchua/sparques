import { Button, FormControl, InputLabel, MenuItem, Select, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import NetworkService from "../services/Network";
import { enqueueSnackbar } from "notistack";
import Community from "../interfaces/Community";

// create a new post
export default function NewPost() {
  const [community, setCommunity] = useState("main");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // only if this page became active
    if (location.pathname === "/newpost") {
      NetworkService.getCommunities().then(result => {
        setCommunities(result);
        console.log("Get community list", result);
      });
    }
  }, [location.pathname]);

  function onSubmit() {
    if (!title || !content || !community) return;
    NetworkService.postNewPost(title, content, community).then(result => {
      enqueueSnackbar("Post created!");
      navigate("/post/" + result._id);
    }).catch(err => {
      enqueueSnackbar("Failed to post: " + err.response.data.message, { variant: "error" });
    });
  }

  return communities.length > 0 ? (
    <>
      <Typography variant="h4" sx={{ marginBottom: "18px" }}>New Post</Typography>
      <FormControl fullWidth sx={{ marginBottom: "12px" }}>
        <InputLabel>Community</InputLabel>
        <Select
          value={community}
          label="Community"
          onChange={event => setCommunity(event.target.value)}
        >
          {communities.map(value =>
            <MenuItem value={value.title} key={value.title}>{value.title}</MenuItem>
          )}
        </Select>
      </FormControl>
      <TextField
        label="Title"
        value={title}
        onChange={event => setTitle(event.target.value)}
        size="small"
        sx={{ marginBottom: "12px" }}
        fullWidth
      /><br />
      <TextField
        value={content}
        onChange={event => setContent(event.target.value)}
        multiline
        minRows={6}
        sx={{ marginBottom: "12px" }}
        fullWidth
      /><br />
      <Button
        variant="contained"
        sx={{ marginRight: "12px" }}
        onClick={onSubmit}
        disabled={!content || !title || !community}
      >
        Post
      </Button>
      <Button
        variant="outlined"
        color="info"
        onClick={() => navigate(-1)}
      >
        Discard
      </Button>
    </>
  ) : (
    <>
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
    </>
  );
}