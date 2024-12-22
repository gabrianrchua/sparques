import { Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router";
import styles from "./Login.module.css";
import NetworkService from "../services/Network";
import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function register() {
    console.log(NetworkService.postRegister(username, password));
  }

  return (
    <>
      <Typography variant="h4">Welcome to Sparques</Typography>
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
        onClick={register}
        disabled={!username || !password}
      >
          Register
      </Button><br />
      <Link to="/login" className={styles.routerLink}>Already have an account? Log in here.</Link>
    </>
  );
}