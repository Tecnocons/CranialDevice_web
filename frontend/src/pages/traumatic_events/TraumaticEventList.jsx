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
import AddTraumaticEventDialog from './AddTraumaticEventDialog';
import EditTraumaticEventDialog from './EditTraumaticEventDialog';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import './TraumaticEventList.css';

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

const TraumaticEventListContainer = styled(Container)(({ theme }) => ({
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

function TraumaticEventList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;

      try {
        const response = await fetch('http://localhost:5000/api/traumatic_events', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
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
      const response = await fetch(`http://localhost:5000/api/traumatic_events/${id}`, {
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

      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting traumatic event:', error.message);
    }
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleEventAdded = () => {
    setAddDialogOpen(false);
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/traumatic_events', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  };

  const handleEditDialogOpen = (event) => {
    setSelectedEvent(event);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEditSubmit = async (updatedEvent) => {
    try {
      const response = await fetch(`http://localhost:5000/api/traumatic_events`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
        )
      );
      setEditDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating traumatic event:', error.message);
    }
  };

  const handleDeleteDialogOpen = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
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
            Lista Eventi Traumatici
          </Typography>
        </HeaderContainer>
        <Box display="flex" justifyContent="center" width="100%" flexWrap="wrap">
          <TraumaticEventListContainer component={Paper} className="table-container">
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
                  Aggiungi Evento Traumatico
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
                {events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    {user && user.isAdmin && (
                      <TableCell>
                        <IconButton onClick={() => handleEditDialogOpen(event)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteDialogOpen(event)}>
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
              count={events.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TraumaticEventListContainer>
        </Box>
        <AddTraumaticEventDialog open={addDialogOpen} onClose={handleAddDialogClose} onEventAdded={handleEventAdded} />
        {selectedEvent && (
          <EditTraumaticEventDialog
            open={editDialogOpen}
            onClose={handleEditDialogClose}
            onEditSubmit={handleEditSubmit}
            event={selectedEvent}
          />
        )}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Conferma Eliminazione</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Sei sicuro di voler eliminare l'evento traumatico {selectedEvent?.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Annulla
            </Button>
            <Button onClick={() => handleDelete(selectedEvent.id)} color="primary">
              Elimina
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </BackgroundWrapper>
  );
}

export default TraumaticEventList;
