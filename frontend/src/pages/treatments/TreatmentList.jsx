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
import AddTreatmentDialog from './AddTreatmentDialog';
import EditTreatmentDialog from './EditTreatmentDialog';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import { useNavigate } from 'react-router-dom';
import './TreatmentList.css';

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

const TreatmentListContainer = styled(Container)(({ theme }) => ({
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

function TreatmentList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  useEffect(() => {
    const fetchTreatments = async () => {
      if (!user) return;

      try {
        const response = await fetch('http://localhost:5000/api/treatments', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTreatments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTreatments();
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
      const response = await fetch(`http://localhost:5000/api/treatments/${id}`, {
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

      setTreatments((prevTreatments) => prevTreatments.filter((treatment) => treatment.id !== id));
      setDeleteDialogOpen(false);
      setSelectedTreatment(null);
    } catch (error) {
      console.error('Error deleting treatment:', error.message);
    }
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleTreatmentAdded = () => {
    setAddDialogOpen(false);
    const fetchTreatments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/treatments', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTreatments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTreatments();
  };

  const handleEditDialogOpen = (treatment) => {
    setSelectedTreatment(treatment);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedTreatment(null);
  };

  const handleEditSubmit = async (updatedTreatment) => {
    try {
      const response = await fetch('http://localhost:5000/api/treatments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedTreatment),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setTreatments((prevTreatments) =>
        prevTreatments.map((treatment) =>
          treatment.id === updatedTreatment.id ? { ...treatment, ...updatedTreatment } : treatment
        )
      );
      setEditDialogOpen(false);
      setSelectedTreatment(null);
    } catch (error) {
      console.error('Error updating treatment:', error.message);
    }
  };

  const handleDeleteDialogOpen = (treatment) => {
    setSelectedTreatment(treatment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedTreatment(null);
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
            Lista Trattamenti
          </Typography>
        </HeaderContainer>
        <Box display="flex" justifyContent="center" width="100%" flexWrap="wrap">
          <TreatmentListContainer component={Paper} className="table-container">
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
                  Aggiungi Trattamento
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
                {treatments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((treatment) => (
                  <TableRow key={treatment.id}>
                    <TableCell>{treatment.name}</TableCell>
                    <TableCell>{treatment.description}</TableCell>
                    {user && user.isAdmin && (
                      <TableCell>
                        <IconButton onClick={() => handleEditDialogOpen(treatment)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteDialogOpen(treatment)}>
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
              count={treatments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TreatmentListContainer>
        </Box>
        <AddTreatmentDialog open={addDialogOpen} onClose={handleAddDialogClose} onTreatmentAdded={handleTreatmentAdded} />
        {selectedTreatment && (
          <EditTreatmentDialog
            open={editDialogOpen}
            onClose={handleEditDialogClose}
            onEditSubmit={handleEditSubmit}
            treatment={selectedTreatment}
          />
        )}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Conferma Eliminazione</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Sei sicuro di voler eliminare il trattamento {selectedTreatment?.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Annulla
            </Button>
            <Button onClick={() => handleDelete(selectedTreatment.id)} color="primary">
              Elimina
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </BackgroundWrapper>
  );
}

export default TreatmentList;
