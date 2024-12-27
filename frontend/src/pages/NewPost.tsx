import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

const SAMPLE_COMMUNITIES: string[] = [ "main", "funny", "memes", "gaming", "pics" ]; // TODO: fetch from server

// create a new post
export default function NewPost() {
  const [community, setCommunity] = useState("main");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h4" sx={{ marginBottom: "18px" }}>New Post</Typography>
      <FormControl fullWidth sx={{ marginBottom: "12px" }}>
        <InputLabel>Community</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={community}
          label="Community"
          onChange={event => setCommunity(event.target.value)}
        >
          {SAMPLE_COMMUNITIES.map(value =>
            <MenuItem value={value} key={value}>{value}</MenuItem>
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
      <Button variant="contained" onClick={() => console.log("post")} sx={{ marginRight: "12px" }}>Post</Button>
      <Button variant="outlined" color="info" onClick={() => navigate(-1)}>Discard</Button>
    </>
  );
}