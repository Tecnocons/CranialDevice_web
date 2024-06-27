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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import HamburgerMenu from '../../components/HamburgerMenu';

function PathologyList() {
  const { user } = useAuth();
  const [pathologies, setPathologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPathology, setNewPathology] = useState({ name: '', description: '' });

  const fetchPathologies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pathologies', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPathologies(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPathologies();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setNewPathology({ name: '', description: '' });
  };

  const handleAddPathology = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pathologies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newPathology),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await response.json();
      fetchPathologies(); // Refetch the pathologies to update the list
      handleAddDialogClose();
    } catch (error) {
      console.error('Error adding pathology:', error.message);
    }
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
              Lista Patologie
            </Typography>
            {user && (
              <Button className="add-pathology-btn" onClick={handleAddDialogOpen}>
                Aggiungi Patologia
              </Button>
            )}
          </div>
          <Table className="styled-table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header">Nome</TableCell>
                <TableCell className="table-header">Descrizione</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pathologies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pathology) => (
                <TableRow key={pathology.id}>
                  <TableCell>{pathology.name}</TableCell>
                  <TableCell>{pathology.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={pathologies.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="pagination"
          />
        </Container>
      </div>
      <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
        <DialogTitle>Aggiungi Patologia</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Compila i seguenti campi per aggiungere una nuova patologia.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome"
            type="text"
            fullWidth
            value={newPathology.name}
            onChange={(e) => setNewPathology({ ...newPathology, name: e.target.value })}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descrizione"
            type="text"
            fullWidth
            value={newPathology.description}
            onChange={(e) => setNewPathology({ ...newPathology, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} color="primary">
            Annulla
          </Button>
          <Button onClick={handleAddPathology} color="primary">
            Aggiungi
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PathologyList;
