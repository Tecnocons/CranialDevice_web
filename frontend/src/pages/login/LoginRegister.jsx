import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Card, CardContent, Typography, CircularProgress, InputAdornment } from '@mui/material';
import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../../contexts/AuthContext';
import backgroundImage from '../../assets/background.png';  // Importa l'immagine

const orangeColor = '#EB873F';  // Colore arancione estratto dall'immagine di sfondo
const darkOrangeColor = '#CF6F2E';  // Colore arancione più scuro per l'effetto hover del pulsante

// Aggiungi questo stile globale per impedire lo scorrimento della pagina
const GlobalStyle = styled('div')`
  body {
    overflow: hidden;
    margin: 0;  // Rimuove i margini predefiniti del corpo
    padding: 0;  // Rimuove i padding predefiniti del corpo
    height: 100vh;  // Assicura che il corpo riempia l'altezza della finestra
  }
`;

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',  // Align to the right
  alignItems: 'center',
  height: '97vh',
  width: '99vw',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '20px',
  overflow: 'hidden',
  boxSizing: 'border-box',
  '@media (max-width: 600px)': {
    justifyContent: 'center',  // Center the form on small screens
    padding: '10px',
  },
});

const StyledCard = styled(Card)({
  maxWidth: 360,
  width: '100%',
  padding: 32,
  margin: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 16,  // Rounded corners
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',  // Subtle shadow
  '@media (max-width: 600px)': {
    maxWidth: '100%',
    padding: 16,
  },
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

const StyledButton = styled(Button)({
  marginTop: 16,
  backgroundColor: orangeColor,
  color: '#fff',  // White text color for contrast
  borderRadius: 8,  // Rounded corners
  padding: '12px 0',
  fontSize: '16px',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: darkOrangeColor,
  },
  transition: 'background-color 0.3s ease',  // Smooth transition
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,  // Rounded corners
    '&:hover fieldset': {
      borderColor: orangeColor,
      borderWidth: 2,
    },
    '&.Mui-focused fieldset': {
      borderColor: darkOrangeColor,
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: orangeColor,
    '&.Mui-focused': {
      color: darkOrangeColor,
    },
  },
});

const Title = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 700,
  marginBottom: 24,  // Increased margin for better spacing
  textAlign: 'center',
  fontSize: '28px',  // Increased font size
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
      credentials: 'include'  // Includi le credenziali
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
    <>
      <GlobalStyle />
      <Root>
        <StyledCard>
          <CardContent>
            <Title variant="h4" component="h2" gutterBottom>
              Accedi / Login
            </Title>
            <Form onSubmit={handleSubmit}>
              <StyledTextField
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
              <StyledTextField
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
                {isFirstUser ? 'Register' : 'Accedi'}
              </StyledButton>
            </Form>
            {message && <Typography color="error">{message}</Typography>}
          </CardContent>
        </StyledCard>
      </Root>
    </>
  );
}

export default LoginRegister;
