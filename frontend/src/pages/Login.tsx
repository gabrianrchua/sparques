import { Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router";
import styles from "./Login.module.css";
import { useState } from "react";
import NetworkService from "../services/Network";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    console.log(NetworkService.postLogin(username, password));
  }

  return (
    <>
      <Typography variant="h4">Log in to Sparques</Typography>
      <br />
      <TextField
        variant="outlined"
        label="Username"
        required
        className={styles.baselineSpacing}
        size="small"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      /><br />
      <TextField
        variant="outlined"
        label="Password"
        required
        type="password"
        className={styles.baselineSpacing}
        size="small"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      /><br />
      <Button
        variant="contained"
        className={styles.baselineSpacing}
        onClick={login}
        disabled={!username || !password}
      >
        Log in
      </Button><br />
      <Link to="/register" className={styles.routerLink}>Don't have an account? Register here.</Link>
    </>
  );
}