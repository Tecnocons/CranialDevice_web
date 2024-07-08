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
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import logoImage from '../assets/logo-Craniotech.png';
import '../components/HamburgerMenu.css'; // Importa il file CSS

const orangeColor = '#EB873F';  
const darkOrangeColor = '#CF6F2E';  

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
  const location = useLocation();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  if (location.pathname === '/login') {
    return null;
  }

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, onClick: () => navigate('/main'), adminOnly: false },
    { text: 'User List', icon: <ListIcon />, onClick: () => navigate('/users'), adminOnly: true },
    { text: 'Lista pazienti', icon: <PeopleIcon />, onClick: () => navigate('/patients'), adminOnly: false },
    { text: 'Lista patologie', icon: <MedicalServicesIcon />, onClick: () => navigate('/pathologies'), adminOnly: false },
    { text: 'Lista sintomi', icon: <MedicalServicesIcon />, onClick: () => navigate('/symptoms'), adminOnly: false },
    { text: 'Lista eventi traumatici', icon: <EventIcon />, onClick: () => navigate('/traumatic-events'), adminOnly: false },
    { text: 'Lista interventi', icon: <LocalHospitalIcon />, onClick: () => navigate('/surgeries'), adminOnly: false }, // Aggiunto il nuovo tasto
  ];

  const additionalItems = [
    { text: 'Placeholder 1', icon: <HomeIcon />, onClick: () => {}, adminOnly: false },
    { text: 'Placeholder 2', icon: <HomeIcon />, onClick: () => {}, adminOnly: false },
    { text: 'Placeholder 3', icon: <HomeIcon />, onClick: () => {}, adminOnly: false },
    { text: 'Logout', icon: <LogoutIcon />, onClick: () => navigate('/login'), adminOnly: false }
  ];

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: orangeColor, height: '64px' }}>
        <Toolbar>
          <StyledIconButton edge="start" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </StyledIconButton>
          <Typography variant="h6" className="title-HamburgerMenu" style={{ flexGrow: 1, color: 'white' }}>
            CranialDevice Web APP
          </Typography>
          {user && (
            <Tooltip title={user.isAdmin ? 'Admin' : 'User'}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ marginRight: '8px', color: 'white' }}>
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
          className="drawer-container"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <div className="drawer-header">
            <StyledIconButton onClick={toggleDrawer(false)}>
              <CloseIcon style={{ color: '#FFFFFF', marginLeft: '-17px' }} />
            </StyledIconButton>
            <Typography variant="h6" className="drawer-title">
              CranialDevice Web APP
            </Typography>
          </div>
          <List>
            {menuItems.map((item, index) => {
              if (item.adminOnly && !(user && user.isAdmin)) return null;
              return (
                <ListItem button key={index} onClick={item.onClick} className="list-item">
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} className="list-item-text" />
                </ListItem>
              );
            })}
          </List>
          <Divider />
          <List>
            {additionalItems.slice(0, -1).map((item, index) => (
              <ListItem button key={index} onClick={item.onClick} className="list-item">
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} className="list-item-text" />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {additionalItems.slice(-1).map((item, index) => (
              <ListItem button key={index} onClick={item.onClick} className="logout-button list-item">
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} className="list-item-text" />
              </ListItem>
            ))}
          </List>
          <div className="spacer"></div>
          <div className="logo-container">
            <img src={logoImage} alt="Logo" className="logo-image" />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default HamburgerMenu;
