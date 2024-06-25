import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Card, CardContent, Typography, CircularProgress, InputAdornment } from '@mui/material';
import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../../contexts/AuthContext';

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f5f5f5',
});

const StyledCard = styled(Card)({
  maxWidth: 400,
  padding: 16,
  margin: 16,
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

const StyledButton = styled(Button)({
  marginTop: 16,
});

const Title = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 700,
  marginBottom: 16,
});

function LoginRegister() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isFirstUser, setIsFirstUser] = useState(null);

  useEffect(() => {
    const checkFirstUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-admin');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setIsFirstUser(data.isFirstUser);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    checkFirstUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isFirstUser ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      setUser({ name: data.name, isAdmin: data.isAdmin });
      navigate(`/main?admin=${data.isAdmin}`);
    }
  };

  if (isFirstUser === null) {
    return (
      <Root>
        <CircularProgress />
      </Root>
    );
  }

  return (
    <Root>
      <StyledCard>
        <CardContent>
          <Title variant="h4" component="h2" gutterBottom>
            {isFirstUser ? 'Register as Admin' : 'Login'}
          </Title>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <StyledButton type="submit" variant="contained" color="primary">
              {isFirstUser ? 'Register' : 'Login'}
            </StyledButton>
          </Form>
          {message && <Typography color="error">{message}</Typography>}
        </CardContent>
      </StyledCard>
    </Root>
  );
}

export default LoginRegister;
