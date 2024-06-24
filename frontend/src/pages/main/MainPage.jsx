import React from 'react';
import { Container, Typography } from '@mui/material';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';

const MainPage = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Main Page
        </Typography>
        <Typography>
          {user.isAdmin ? 'Welcome, Admin! You have full access.' : 'Welcome, User! Your access is limited.'}
        </Typography>
      </Container>
    </>
  );
};

export default MainPage;
