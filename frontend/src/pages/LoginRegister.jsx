import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

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

function LoginRegister() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isFirstUser, setIsFirstUser] = useState(null); // Initially null to indicate loading

  useEffect(() => {
    const checkFirstUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/check-admin');
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
    const url = isFirstUser ? 'http://localhost:5000/register' : 'http://localhost:5000/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();
    setMessage(data.message);
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
          <Typography variant="h5" component="h2" gutterBottom>
            {isFirstUser ? 'Register as Admin' : 'Login'}
          </Typography>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
