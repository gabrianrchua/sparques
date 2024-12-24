import { Box, Button, TextField } from "@mui/material";

export default function CommentEditor(props: { value: string, setValue: Function, onSubmit: Function }) {
  return (
    <Box sx={{ display: "flex" }}>
      <TextField
        variant="outlined"
        color="primary"
        multiline
        maxRows={6}
        value={props.value}
        onChange={event => props.setValue(event.target.value)}
        size="small"
        sx={{ flexGrow: 1, marginRight: "6px" }}
        inputRef={input => input && input.focus()}
      />
      <Button color="primary" variant="contained" sx={{ height: "fit-content", borderRadius: "18px" }} onClick={() => props.onSubmit(props.value)}>Comment</Button>
    </Box>
  )
}