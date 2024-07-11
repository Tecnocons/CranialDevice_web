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
  Box,
  TablePagination,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import EditIcon2 from '@mui/icons-material/PhonelinkRing';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../contexts/AuthContext';
import { ClipLoader } from 'react-spinners';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import './UserList.css';

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f5f5f5', // Cambiato il background del Root
  opacity: 0.9,
  padding: '20px',
});

const StyledTable = styled(Table)({
  minWidth: 650,
  backgroundColor: '#ffffff', // Cambiato il background della tabella
  '& .MuiTableCell-head': {
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
    fontSize: 21,
  },
  '& .MuiTableCell-body': {
    fontSize: 16,
  },
  '& .MuiTableRow-root:last-child .MuiTableCell-root': {
    borderBottom: '2px solid #155677',
  },
});

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: 16,
});

const AddButton = styled(Button)({
  backgroundColor: '#155677',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#0d3e4f',
  },
});

const FilterBox = styled(Box)({
  width: '20%',
  minHeight: '100px',  // Altezza minima
  maxHeight: '100px',  // Altezza massima
  padding: '10px',
  borderRadius: '18px',
  backgroundColor: '#f9f9f9', // Cambiato il background del FilterBox
  opacity: 0.95, // Meno opaco
  marginRight: '2%',
  marginLeft: '1%',
  boxShadow: '0 0 10px rgba(21, 86, 119, 0.5)', // Ridotta l'ombra
});

const UserListContainer = styled(Container)({
  width: '65%',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '20px',
  backgroundColor: '#ffffff', // Cambiato il background della UserListContainer
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(21, 86, 119, 0.5)',
});

const HeaderContainer = styled(Box)({
  width: '17%',
  height:'6%',
  backgroundColor: '#155677',
  color: '#fff',
  padding: '10px',
  borderRadius: '8px',
  textAlign: 'center',
  marginBottom: '20px',
  marginTop: '-5px',
  opacity: 1, 
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
});

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openHelmet, setOpenHelmet] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [helmetId, setHelmetId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [nameFilter, setNameFilter] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
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
      setPassword(data.password);
      setIsAdmin(data.isadmin);
      setHelmetId(data.helmetId);
      setOpenEdit(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleCloseHelmet = () => {
    setOpenHelmet(false);
  };

  const handleSave = async () => {
    const updatedPassword = password === '' ? null : password;
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
      handleCloseEdit();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddClick = () => {
    setName('');
    setPassword('');
    setIsAdmin(false);
    setOpenAdd(true);
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password, isadmin: isAdmin }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await response.json();
      fetchUsers();
      handleCloseAdd();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleHelmetClick = (user) => {
    setSelectedUser(user);
    setHelmetId(user.helmetId || '');
    setOpenHelmet(true);
  };

  const handleHelmetSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser.uuid}/helmet`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ helmetId }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedUser = { ...selectedUser, helmetId };
      setUsers(users.map((user) => (user.uuid === updatedUser.uuid ? updatedUser : user)));
      handleCloseHelmet();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    setNameFilter(e.target.value);
  };

  // Aggiorna il filtro per utilizzare startsWith
  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().startsWith(nameFilter.toLowerCase());
  });

  if (loading) {
    return (
      <Root>
        <Box display="flex" flexDirection="column" alignItems="center">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
          <Typography variant="h6" style={{ marginTop: '20px' }}>Loading...</Typography>
        </Box>
      </Root>
    );
  }

  if (error) {
    return (
      <Root>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" color="error">Error: {error}</Typography>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>Retry</Button>
        </Box>
      </Root>
    );
  }

  return (
    <BackgroundWrapper>
      <Root>
        <HeaderContainer>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            style={{ textShadow: '-1px 0 #000000, 0 1px #000000, 1px 0 #000000, 0 -1px #000000' }} // Aggiunta l'ombra del testo
          >
            User List
          </Typography>
        </HeaderContainer>
        <Box display="flex" justifyContent="center" width="100%">
          <FilterBox>
            <TextField
              placeholder="Search..."
              autoComplete='off'
              value={nameFilter}
              onChange={handleFilterChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: '#fff', // Background color of the input field
                  borderRadius: '18px', // Rounded corners for the input field
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#155677', // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#155677', // Border color when hovering
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#155677', // Border color when focused
                  },
                },
              }}
            />
          </FilterBox>
          <UserListContainer component={Paper} className="table-container">
            <Header>
              <IconButton onClick={() => navigate('/main')}>
                <CloseIcon />
              </IconButton>
              <AddButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
              >
                Add User
              </AddButton>
            </Header>
            <StyledTable className="styled-table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Helmet ID</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <TableRow key={user.uuid}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.isadmin ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{user.helmetId}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleHelmetClick(user)}>
                        <EditIcon2 />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="pagination"
            />
          </UserListContainer>
        </Box>
        <Dialog open={openEdit} onClose={handleCloseEdit}>
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
            <Button onClick={handleCloseEdit} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openAdd} onClose={handleCloseAdd}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the details of the new user.
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
            <Button onClick={handleCloseAdd} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddUser} color="primary">
              Add User
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openHelmet} onClose={handleCloseHelmet}>
          <DialogTitle>Assign Helmet ID</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the Helmet ID to associate with the user.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Helmet ID"
              type="text"
              fullWidth
              value={helmetId}
              onChange={(e) => setHelmetId(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseHelmet} color="primary">
                Cancel
              </Button>
              <Button onClick={handleHelmetSave} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Root>
        </BackgroundWrapper>
        );
        }
        
        export default UserList;
        
