import { Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router";
import styles from "./Login.module.css";

export default function Login() {
  return (
    <>
      <Typography variant="h4">Log in to Sparques</Typography>
      <br />
      <TextField variant="outlined" label="Username" required className={styles.baselineSpacing} size="small" /><br />
      <TextField variant="outlined" label="Password" required type="password" className={styles.baselineSpacing} size="small" /><br />
      <Button variant="contained" className={styles.baselineSpacing}>Log in</Button><br />
      <Link to="/register" className={styles.routerLink}>Don't have an account? Register here.</Link>
    </>
  );
}