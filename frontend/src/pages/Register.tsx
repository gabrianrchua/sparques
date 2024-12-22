import { Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router";
import styles from "./Login.module.css";

export default function Register() {
  return (
    <>
      <Typography variant="h4">Welcome to Sparques</Typography>
      <br />
      <TextField variant="outlined" label="Username" required className={styles.baselineSpacing} size="small" /><br />
      <TextField variant="outlined" label="Password" required type="password" className={styles.baselineSpacing} size="small" /><br />
      <Button variant="contained"className={styles.baselineSpacing}>Register</Button><br />
      <Link to="/login" className={styles.routerLink}>Already have an account? Log in here.</Link>
    </>
  );
}