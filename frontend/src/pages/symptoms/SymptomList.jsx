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
  Button,
  TablePagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
  Link,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import AddSymptomDialog from './AddSymptomDialog';
import EditSymptomDialog from './EditSymptomDialog';
import { useNavigate } from 'react-router-dom';
import './SymptomList.css';
import HamburgerMenu from '../../components/HamburgerMenu';

function SymptomList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  const handleSelectSymptom = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((symptomId) => symptomId !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const isSelected = (id) => selectedSymptoms.includes(id);

  const handleSelectAllSymptoms = (event) => {
    if (event.target.checked) {
      const newSelecteds = symptoms.map((symptom) => symptom.id);
      setSelectedSymptoms(newSelecteds);
    } else {
      setSelectedSymptoms([]);
    }
  };

  const isAllSelected = selectedSymptoms.length === symptoms.length;

  const handleMultipleDelete = () => {
    setDeleteDialogOpen(true);
    setSelectedSymptom(null);
  };

  if (loading) {
    return (
      <div className="root">
        <Typography>Loading...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="root">
        <Typography>Error: {error}</Typography>
      </div>
    );
  }

  return (
    <div className="root">
      <HamburgerMenu />
      <div className="content">
        <Container component={Paper} className="table-container">
          <div className="table-header-container">
            <Typography variant="h4" gutterBottom>
              Lista Sintomi
            </Typography>
            {user && user.isAdmin && (
              <Button className="add-symptom-btn" onClick={handleAddDialogOpen}>
                Aggiungi Sintomo
              </Button>
            )}
            {user && user.isAdmin && selectedSymptoms.length > 0 && (
              <Button color="secondary" onClick={handleMultipleDelete}>
                Elimina Selezionati
              </Button>
            )}
          </div>
          <Table className="styled-table">
            <TableHead>
              <TableRow>
                {user && user.isAdmin && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedSymptoms.length > 0 && selectedSymptoms.length < symptoms.length}
                      checked={isAllSelected}
                      onChange={handleSelectAllSymptoms}
                    />
                  </TableCell>
                )}
                <TableCell className="table-header">Nome</TableCell>
                <TableCell className="table-header">Descrizione</TableCell>
                {user && user.isAdmin && <TableCell className="table-header">Azioni</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {symptoms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((symptom) => (
                <TableRow
                  key={symptom.id}
                  hover
                  role="checkbox"
                  aria-checked={isSelected(symptom.id)}
                  selected={isSelected(symptom.id)}
                >
                  {user && user.isAdmin && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(symptom.id)}
                        onChange={() => handleSelectSymptom(symptom.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{symptom.name}</TableCell>
                  <TableCell>{symptom.description}</TableCell>
                  {user && user.isAdmin && (
                    <TableCell>
                      <IconButton onClick={() => handleEditDialogOpen(symptom)} color="primary" disabled={selectedSymptoms.length > 0}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteDialogOpen(symptom)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={symptoms.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="pagination"
          />
        </Container>
      </div>
      {user && (
        <AddSymptomDialog open={addDialogOpen} onClose={handleAddDialogClose} onSymptomAdded={handleSymptomAdded} />
      )}
      {user && selectedSymptom && (
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
          <Button
            onClick={() => handleDelete(selectedSymptom ? [selectedSymptom.id] : selectedSymptoms)}
            color="primary"
            autoFocus
          >
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SymptomList;
