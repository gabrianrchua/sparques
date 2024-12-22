import { Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router";
import styles from "./Login.module.css";
import NetworkService from "../services/Network";
import { useState } from "react";
import { useSnackbar } from "notistack";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  function register() {
    NetworkService.postRegister(username, password).then(() => {
      enqueueSnackbar("Successfully registered! Please log in now.");
      navigate("/login");
    }).catch(err => {
      enqueueSnackbar("Failed to log in: " + err.response.data.message, { variant: "error" });
    });
  }

  return (
    <>
      <Typography variant="h4">Welcome to Sparques</Typography>
      <br />
      <TextField
        variant="outlined"
        label="Username"
        required
        sx={{ marginBottom: "12px "}}
        size="small"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      /><br />
      <TextField
        variant="outlined"
        label="Password"
        required
        type="password"
        sx={{ marginBottom: "12px "}}
        size="small"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      /><br />
      <Button
        variant="contained"
        sx={{ marginBottom: "12px "}}
        onClick={register}
        disabled={!username || !password}
      >
          Register
      </Button><br />
      <Link to="/login" className={styles.routerLink}>Already have an account? Log in here.</Link>
    </>
  );
}