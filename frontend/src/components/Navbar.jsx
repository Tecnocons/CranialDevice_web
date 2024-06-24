import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My Web App
        </Typography>
        {user && user.isAdmin && (
          <>
            <Button color="inherit" onClick={() => navigate('/add-user')}>
              Add User
            </Button>
            <Button color="inherit" onClick={() => navigate('/users')}>
              User List
            </Button>
          </>
        )}
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
