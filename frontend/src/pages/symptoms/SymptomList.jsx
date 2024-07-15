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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../contexts/AuthContext';
import { ClipLoader } from 'react-spinners';
import AddSymptomDialog from './AddSymptomDialog';
import EditSymptomDialog from './EditSymptomDialog';
import BackgroundWrapper from '../../components/BackgroundWrapper'; // Importa BackgroundWrapper
import { useNavigate } from 'react-router-dom';
import './SymptomList.css';

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

const SymptomListContainer = styled(Container)(({ theme }) => ({
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

function SymptomList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  useEffect(() => {
    const fetchSymptoms = async () => {
      if (!user) return;

      try {
        const response = await fetch('http://localhost:5000/api/symptoms', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSymptoms(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSymptoms();
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (ids) => {
    try {
      const response = await fetch('http://localhost:5000/api/symptoms', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSymptoms((prevSymptoms) => prevSymptoms.filter((symptom) => !ids.includes(symptom.id)));
      setDeleteDialogOpen(false);
      setSelectedSymptoms([]);
      setSelectedSymptom(null);
    } catch (error) {
      console.error('Error deleting symptom:', error.message);
    }
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleSymptomAdded = () => {
    setAddDialogOpen(false);
    const fetchSymptoms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/symptoms', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSymptoms(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSymptoms();
  };

  const handleEditDialogOpen = (symptom) => {
    setSelectedSymptom(symptom);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedSymptom(null);
  };

  const handleEditSubmit = async (updatedSymptom) => {
    try {
      const response = await fetch(`http://localhost:5000/api/symptoms`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedSymptom),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSymptoms((prevSymptoms) =>
        prevSymptoms.map((symptom) =>
          symptom.id === updatedSymptom.id ? { ...symptom, ...updatedSymptom } : symptom
        )
      );
      setEditDialogOpen(false);
      setSelectedSymptom(null);
    } catch (error) {
      console.error('Error updating symptom:', error.message);
    }
  };

  const handleDeleteDialogOpen = (symptom) => {
    setSelectedSymptom(symptom);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedSymptom(null);
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
          <Typography variant="h4" component="h1" gutterBottom>
            Lista Sintomi
          </Typography>
        </HeaderContainer>
        <Box display="flex" justifyContent="center" width="100%" flexWrap="wrap">
          <SymptomListContainer component={Paper} className="table-container">
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
                  Aggiungi Sintomo
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
                {symptoms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((symptom) => (
                  <TableRow key={symptom.id}>
                    <TableCell>{symptom.name}</TableCell>
                    <TableCell>{symptom.description}</TableCell>
                    {user && user.isAdmin && (
                      <TableCell>
                        <IconButton onClick={() => handleEditDialogOpen(symptom)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteDialogOpen(symptom)}>
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
              count={symptoms.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="pagination"
            />
          </SymptomListContainer>
        </Box>
        {user && user.isAdmin && (
          <AddSymptomDialog open={addDialogOpen} onClose={handleAddDialogClose} onSymptomAdded={handleSymptomAdded} />
        )}
        {user && user.isAdmin && selectedSymptom && (
          <EditSymptomDialog
            open={editDialogOpen}
            onClose={handleEditDialogClose}
            onEditSubmit={handleEditSubmit}
            symptom={selectedSymptom}
          />
        )}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Conferma Eliminazione</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedSymptom
                ? `Sei sicuro di voler eliminare il sintomo ${selectedSymptom.name}?`
                : 'Sei sicuro di voler eliminare i sintomi selezionati?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Annulla
            </Button>
            <Button onClick={() => handleDelete(selectedSymptom ? [selectedSymptom.id] : selectedSymptoms)} color="primary">
              Elimina
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </BackgroundWrapper>
  );
}

export default SymptomList;
