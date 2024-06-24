import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import Navbar from '../../components/Navbar';
import { useLocation } from 'react-router-dom';

const MainPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const adminStatus = searchParams.get('admin');
    setIsAdmin(adminStatus === 'true');
  }, [location]);

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Main Page
        </Typography>
        <Typography>
          {isAdmin ? 'Welcome, Admin! You have full access.' : 'Welcome, User! Your access is limited.'}
        </Typography>
      </Container>
    </>
  );
};

export default MainPage;
    