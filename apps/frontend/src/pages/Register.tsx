import { Button, TextField, Typography, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import styles from './Login.module.css';
import NetworkService from '../services/Network';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const theme = useTheme();

  const register = () => {
    NetworkService.postRegister(username, password)
      .then(() => {
        enqueueSnackbar('Successfully registered! Please log in now.');
        navigate('/login');
      })
      .catch((err) => {
        enqueueSnackbar('Failed to register: ' + err.response.data.message, {
          variant: 'error',
        });
      });
  };

  /**
   * returns `[true, "message"]` if there is a problem with the password, else `[false, ""]`
   */
  const validatePassword = (): [boolean, string] => {
    // https://stackoverflow.com/a/21456918
    const passwordRegex =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}/;
    if (!password.match(passwordRegex))
      return [
        true,
        'Password must be at least 8 characters and contain at least one symbol, uppercase letter, and number.',
      ];
    if (password !== confirmPassword) return [true, 'Passwords do not match.'];
    return [false, ''];
  };

  return (
    <>
      <Typography variant='h4'>Welcome to Sparques</Typography>
      <br />
      <TextField
        variant='outlined'
        label='Username'
        required
        sx={{ marginBottom: '12px ' }}
        size='small'
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <br />
      <TextField
        variant='outlined'
        label='Password'
        required
        type='password'
        sx={{ marginBottom: '12px ' }}
        size='small'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <br />
      <TextField
        variant='outlined'
        label='Confirm Password'
        required
        type='password'
        sx={{ marginBottom: '12px ' }}
        size='small'
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        error={password.length > 0 && validatePassword()[0]}
      />
      <br />
      {password.length > 0 && (
        <Typography
          variant='body2'
          color={theme.palette.error.dark}
          sx={{ marginBottom: '12px ' }}
        >
          {validatePassword()[1]}
        </Typography>
      )}
      <Button
        variant='contained'
        sx={{ marginBottom: '12px ' }}
        onClick={register}
        disabled={!username || !password || validatePassword()[0]}
      >
        Register
      </Button>
      <br />
      <Link to='/login' className={styles.routerLink}>
        Already have an account? Log in here.
      </Link>
    </>
  );
};

export default Register;
