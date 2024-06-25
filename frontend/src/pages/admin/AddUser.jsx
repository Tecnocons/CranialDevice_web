import React, { useState } from 'react';
import { Container, TextField, Button, Card, CardContent, Typography, InputAdornment, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

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

function AddUser() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password, isadmin: isAdmin }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  const handleClose = () => {
    navigate('/main'); // Navigate back to the main page
  };

  return (
    <Root>
      <StyledCard>
        <CardContent>
          <IconButton onClick={handleClose} style={{ alignSelf: 'flex-end' }}>
            <CloseIcon />
          </IconButton>
          <Title variant="h4" component="h2" gutterBottom>
            Add New User
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  name="isAdmin"
                  color="primary"
                />
              }
              label="Admin"
            />
            <StyledButton type="submit" variant="contained" color="primary">
              Add User
            </StyledButton>
          </Form>
          {message && <Typography color="error">{message}</Typography>}
        </CardContent>
      </StyledCard>
    </Root>
  );
}

export default AddUser;
