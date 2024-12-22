import { Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router";
import styles from "./Login.module.css";
import { useState } from "react";
import NetworkService from "../services/Network";
import { useSnackbar } from "notistack";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  function login() {
    NetworkService.postLogin(username, password).then(() => {
      enqueueSnackbar("Successfully logged in!");
      navigate("/");
    }).catch(err => {
      enqueueSnackbar("Failed to log in: " + err.response.data.message);
    });
  }

  return (
    <>
      <Typography variant="h4">Log in to Sparques</Typography>
      <br />
      <TextField
        variant="outlined"
        label="Username"
        required
        size="small"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        sx={{ marginBottom: "12px "}}
      /><br />
      <TextField
        variant="outlined"
        label="Password"
        required
        type="password"
        size="small"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        sx={{ marginBottom: "12px "}}
      /><br />
      <Button
        variant="contained"
        sx={{ marginBottom: "12px "}}
        onClick={login}
        disabled={!username || !password}
      >
        Log in
      </Button><br />
      <Link to="/register" className={styles.routerLink}>Don't have an account? Register here.</Link>
    </>
  );
}