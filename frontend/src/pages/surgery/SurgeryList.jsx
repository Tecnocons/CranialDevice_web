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
  Button,
  Box,
  TablePagination,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../contexts/AuthContext';
import { ClipLoader } from 'react-spinners';
import AddSurgeryDialog from './AddSurgeryDialog';
import EditSurgeryDialog from './EditSurgeryDialog';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import './SurgeryList.css';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f5f5f5',
  opacity: 0.9,
  padding: '20px',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  opacity: 0.9,
  width: '100%',
  backgroundColor: '#ffffff',
  boxShadow: '0 0 10px rgba(21, 86, 119, 0.5)',
  '& .MuiTableCell-head': {
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
    fontSize: 22,
  },
  '& .MuiTableCell-body': {
    fontSize: 17,
  },
  '& .MuiTableRow-root .MuiTableCell-root': {
    borderBottom: '1px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
    fontFamily: 'Arial, sans-serif',
  },
  '& .MuiTableRow-root:last-child .MuiTableCell-root': {
    borderBottom: '2px solid #155677',
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiTableCell-head': {
      fontSize: 16,
    },
    '& .MuiTableCell-body': {
      fontSize: 12,
    },
  },
}));

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: 10,
});

const AddButton = styled(Button)({
  backgroundColor: '#155677',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#0d3e4f',
  },
});

const SurgeryListContainer = styled(Container)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(21, 86, 119, 0.5)',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  width: '70%',
  height: 'auto',
  backgroundColor: '#155677',
  color: '#fff',
  padding: '10px',
  borderRadius: '8px',
  textAlign: 'center',
  marginBottom: '10px',
  marginTop: '-13px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: '5px',
    fontSize: '1rem',
  },
}));

function SurgeryList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSurgery, setSelectedSurgery] = useState(null);

  useEffect(() => {
    const fetchSurgeries = async () => {
      if (!user) return;

      try {
        const response = await fetch('http://localhost:5000/api/surgeries', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSurgeries(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSurgeries();
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/surgeries/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

      setSurgeries((prevSurgeries) => prevSurgeries.filter((surgery) => surgery.id !== id));
      setDeleteDialogOpen(false);
      setSelectedSurgery(null);
    } catch (error) {
      console.error('Error deleting surgery:', error.message);
    }
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleSurgeryAdded = () => {
    setAddDialogOpen(false);
    const fetchSurgeries = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/surgeries', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSurgeries(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSurgeries();
  };

  const handleEditDialogOpen = (surgery) => {
    setSelectedSurgery(surgery);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedSurgery(null);
  };

  const handleEditSubmit = async (updatedSurgery) => {
    try {
      const response = await fetch(`http://localhost:5000/api/surgeries`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedSurgery),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSurgeries((prevSurgeries) =>
        prevSurgeries.map((surgery) =>
          surgery.id === updatedSurgery.id ? { ...surgery, ...updatedSurgery } : surgery
        )
      );
      setEditDialogOpen(false);
      setSelectedSurgery(null);
    } catch (error) {
      console.error('Error updating surgery:', error.message);
    }
  };

  const handleDeleteDialogOpen = (surgery) => {
    setSelectedSurgery(surgery);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedSurgery(null);
  };

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
            style={{ textShadow: '-1px 0 #000000, 0 1px #000000, 1px 0 #000000, 0 -1px #000000' }}
          >
            Lista Interventi
          </Typography>
        </HeaderContainer>
        <Box display="flex" justifyContent="center" width="100%" flexWrap="wrap">
          <SurgeryListContainer component={Paper} className="table-container">
            <Header>
              <IconButton onClick={() => navigate('/main')}>
                <CloseIcon />
              </IconButton>
              {user && user.isAdmin && (
                <AddButton
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddDialogOpen}
                >
                  Aggiungi Intervento
                </AddButton>
              )}
            </Header>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrizione</TableCell>
                  {user && user.isAdmin && <TableCell>Azioni</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {surgeries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((surgery) => (
                  <TableRow key={surgery.id}>
                    <TableCell>{surgery.name}</TableCell>
                    <TableCell>{surgery.description}</TableCell>
                    {user && user.isAdmin && (
                      <TableCell>
                        <IconButton onClick={() => handleEditDialogOpen(surgery)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteDialogOpen(surgery)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={surgeries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </SurgeryListContainer>
        </Box>
        <AddSurgeryDialog open={addDialogOpen} onClose={handleAddDialogClose} onSurgeryAdded={handleSurgeryAdded} />
        {selectedSurgery && (
          <EditSurgeryDialog
            open={editDialogOpen}
            onClose={handleEditDialogClose}
            onEditSubmit={handleEditSubmit}
            surgery={selectedSurgery}
          />
        )}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Conferma Eliminazione</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Sei sicuro di voler eliminare l'intervento {selectedSurgery?.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Annulla
            </Button>
            <Button onClick={() => handleDelete(selectedSurgery.id)} color="primary">
              Elimina
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </BackgroundWrapper>
  );
}

export default SurgeryList;
