import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'; // Add this import
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

const orangeColor = '#EB873F';  // Colore arancione
const darkOrangeColor = '#CF6F2E';  // Colore arancione più scuro per l'effetto hover

const StyledIconButton = styled(IconButton)({
  color: '#FFFFFF',
  '&:hover': {
    color: '#FFFFFF',
  },
});

const HamburgerMenu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, onClick: () => navigate('/main'), adminOnly: false },
    { text: 'User List', icon: <ListIcon />, onClick: () => navigate('/users'), adminOnly: true },
    { text: 'Lista pazienti', icon: <PeopleIcon />, onClick: () => navigate('/patients'), adminOnly: false },
    { text: 'Lista patologie', icon: <MedicalServicesIcon />, onClick: () => navigate('/pathologies'), adminOnly: false }
  ];

  const additionalItems = [
    { text: 'Placeholder 1', icon: <HomeIcon />, onClick: () => {}, adminOnly: false },
    { text: 'Placeholder 2', icon: <HomeIcon />, onClick: () => {}, adminOnly: false },
    { text: 'Placeholder 3', icon: <HomeIcon />, onClick: () => {}, adminOnly: false },
    { text: 'Logout', icon: <LogoutIcon />, onClick: () => navigate('/login'), adminOnly: false }
  ];

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: orangeColor }}>
        <Toolbar>
          <StyledIconButton edge="start" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </StyledIconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CranialDevice Web APP
          </Typography>
          {user && (
            <Tooltip title={user.isAdmin ? 'Admin' : 'User'}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ marginRight: '8px' }}>
                  {user.name || 'No name'}
                </Typography>
                {user.isAdmin ? (
                  <VerifiedUserIcon style={{ color: 'white' }} />
                ) : (
                  <PersonIcon style={{ color: 'white' }} />
                )}
              </div>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          style={{ width: '300px' }} // Aumenta la larghezza del menu
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <StyledIconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </StyledIconButton>
          <List>
            {menuItems.map((item, index) => {
              if (item.adminOnly && !user.isAdmin) return null;
              return (
                <ListItem button key={index} onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              );
            })}
          </List>
          <Divider />
          <List>
            {additionalItems.slice(0, -1).map((item, index) => (
              <ListItem button key={index} onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {additionalItems.slice(-1).map((item, index) => (
              <ListItem button key={index} onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default HamburgerMenu;
