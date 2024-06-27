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
  }
`;

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',  // Cambia 'center' a 'flex-end' per allineare a destra
  alignItems: 'center',
  height: '92vh',
  width: '210vh',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '20px',
  overflow: 'hidden',
});

const StyledCard = styled(Card)({
  maxWidth: 350,  // Aumenta la larghezza massima
  width: '100%',
  padding: 32,  // Aumenta il padding per più spazio interno
  margin: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',  // Aggiunge uno sfondo semi-trasparente per il contrasto
  marginLeft: 'auto',  // Sposta il card verso destra
  minHeight: 350,  // Aggiunge altezza minima per aumentare l'altezza del form
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

const StyledButton = styled(Button)({
  marginTop: 16,
  backgroundColor: orangeColor,  // Imposta il colore arancione di sfondo
  '&:hover': {
    backgroundColor: darkOrangeColor,  // Colore leggermente più scuro al passaggio del mouse
  }
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: orangeColor,  // Colore arancione al passaggio del mouse
      borderWidth: 2,  // Bordo più spesso al passaggio del mouse
    },
  },
});

const Title = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 700,
  marginBottom: 16,
  textAlign: 'center',  // Centra il testo
  fontSize: '24px',  // Cambia la dimensione del font
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

//
