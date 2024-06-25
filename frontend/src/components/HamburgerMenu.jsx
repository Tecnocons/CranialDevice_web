// src/components/HamburgerMenu.jsx
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HamburgerMenu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Add User', icon: <AddIcon />, onClick: () => navigate('/add-user'), adminOnly: true },
    { text: 'User List', icon: <ListIcon />, onClick: () => navigate('/users'), adminOnly: true },
    { text: 'Lista pazienti', icon: <PeopleIcon />, onClick: () => navigate('/patients'), adminOnly: false }
  ];

  const additionalItems = [
    { text: 'Placeholder 1', icon: <AddIcon />, onClick: () => {}, adminOnly: false },
    { text: 'Placeholder 2', icon: <AddIcon />, onClick: () => {}, adminOnly: false },
    { text: 'Placeholder 3', icon: <AddIcon />, onClick: () => {}, adminOnly: false },
    { text: 'Logout', icon: <LogoutIcon />, onClick: () => navigate('/logout'), adminOnly: false }
  ];

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            My Web App
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          style={{ width: '300px' }} // Aumenta la larghezza del menu
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
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
