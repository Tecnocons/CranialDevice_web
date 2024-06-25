import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../contexts/AuthContext';

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f5f5f5',
});

const StyledTable = styled(Table)({
  minWidth: 650,
});

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: 16,
});

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Data is not an array');
        }
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEditClick = async (user) => {
    setSelectedUser(user);
    setName(user.name);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.uuid}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPassword(data.password); // Set the password field with the decrypted password
      setIsAdmin(data.isadmin);
      setOpen(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    const updatedPassword = password === '' ? null : password; // If password field is empty, do not update the password
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser.uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password: updatedPassword, isadmin: isAdmin }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedUser = { ...selectedUser, name, isadmin: isAdmin };
      setUsers(users.map((user) => (user.uuid === updatedUser.uuid ? updatedUser : user)));
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  if (loading) {
    return <Root><Typography>Loading...</Typography></Root>;
  }

  if (error) {
    return <Root><Typography>Error: {error}</Typography></Root>;
  }

  return (
    <Root>
      <Container component={Paper} style={{ padding: 16 }}>
        <Header>
          <IconButton onClick={() => navigate('/main')}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" component="h1" gutterBottom>
            User List
          </Typography>
        </Header>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uuid}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.isadmin ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(user)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modify the details of the user.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={<Checkbox checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />}
            label="Admin"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
}

export default UserList;
