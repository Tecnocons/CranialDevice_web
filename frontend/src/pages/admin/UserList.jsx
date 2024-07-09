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
  Collapse,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useAuth } from '../../contexts/AuthContext';
import { ClipLoader } from 'react-spinners';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import './UserList.css';

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  height: '100vh',
  backgroundColor: '#ffffff',
  opacity: 0.9,
  padding: '20px', // Aggiungi un padding per dare spazio
  marginTop:'2%',
});

const StyledTable = styled(Table)({
  minWidth: 650,
  '& .MuiTableCell-head': {
    backgroundColor: '#f1f1f1',
    fontWeight: 'bold',
    fontSize: 21,
  },
  '& .MuiTableCell-body': {
    fontSize: 16,
  },
  '& .MuiTableRow-root:last-child .MuiTableCell-root': {
    borderBottom: '2px solid #155677', // Cambia il colore della riga inferiore qui
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
  backgroundColor: '#155677', // Cambia il colore del bottone
  color: '#fff',
  '&:hover': {
    backgroundColor: '#0d3e4f', // Cambia il colore al passaggio del mouse
  },
});

const FilterBox = styled(Box)({
  width: '22%',
  padding: '26px',
  borderRadius: '18px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  opacity: 0.9,
  marginRight: '2%', // Aggiungi un margine a destra
  marginLeft: '1%',
});

const FilterHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '18px',
});

const UserListContainer = styled(Container)({
  width: '65%',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 'auto',
  marginRight: 'auto', 
});

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [nameFilter, setNameFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
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
        credentials: 'include',
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

  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(nameFilter.toLowerCase());
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
        <Box width="100%">
          <Box height="28px" />
          <Box display="flex" justifyContent="space-between">
            <Box width="20px" />
            <FilterBox>
              <Typography variant="h6" component="h2">Ricerca</Typography>
              <TextField
                label="Nome"
                value={nameFilter}
                onChange={handleFilterChange}
                fullWidth
                margin="normal"
              />
              <FilterHeader>
                <Typography variant="subtitle1">Altri Filtri</Typography>
                <IconButton onClick={() => setFiltersOpen(!filtersOpen)}>
                  {filtersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </FilterHeader>
              <Collapse in={filtersOpen}>
                <Grid container spacing={2}>
                  {/* Add more filters here if necessary */}
                </Grid>
              </Collapse>
            </FilterBox>
            <Box width="2%" />
            <UserListContainer component={Paper} className="table-container">
              <Header>
                <IconButton onClick={() => navigate('/main')}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h4" component="h1" gutterBottom>
                  User List
                </Typography>
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
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
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
            <Box width="15px" />
          </Box>
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
      </Root>
    </BackgroundWrapper>
  );
}

export default UserList;
