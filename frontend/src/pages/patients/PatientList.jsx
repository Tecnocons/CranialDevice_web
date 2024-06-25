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
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import AddPatientDialog from '../../components/AddPatientDialog';
import './PatientList.css';
import HamburgerMenu from '../../components/HamburgerMenu';

function PatientList() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;

      try {
        const endpoint = user.isAdmin ? '/api/patients' : `/api/patients/assigned?doctor_name=${user.name}`;
        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (uuid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${uuid}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Aggiorna la lista dei pazienti dopo la cancellazione
      setPatients((prevPatients) => prevPatients.filter((patient) => patient.uuid !== uuid));
      setDeleteDialogOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error deleting patient:', error.message);
    }
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handlePatientAdded = () => {
    setAddDialogOpen(false);
    // Ricarica i pazienti dopo aver aggiunto un nuovo paziente
    const fetchPatients = async () => {
      try {
        const endpoint = user.isAdmin ? '/api/patients' : `/api/patients/assigned?doctor_name=${user.name}`;
        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  };

  const handleDeleteDialogOpen = (patient) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedPatient(null);
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
              Lista Pazienti
            </Typography>
            {user && !user.isAdmin && (
              <Button className="add-patient-btn" onClick={handleAddDialogOpen}>
                Aggiungi
              </Button>
            )}
          </div>
          <Table className="styled-table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header">Nominativo</TableCell>
                <TableCell className="table-header">Età</TableCell>
                <TableCell className="table-header">Altezza</TableCell>
                <TableCell className="table-header">Peso</TableCell>
                {user && user.isAdmin && <TableCell className="table-header">Dottore</TableCell>}
                {user && !user.isAdmin && <TableCell className="table-header">Azioni</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
                <TableRow key={patient.uuid}>
                  <TableCell>{patient.nominativo}</TableCell>
                  <TableCell>{patient.eta}</TableCell>
                  <TableCell>{patient.altezza}</TableCell>
                  <TableCell>{patient.peso}</TableCell>
                  {user && user.isAdmin && <TableCell>{patient.doctor_name}</TableCell>}
                  {user && !user.isAdmin && (
                    <TableCell>
                      <IconButton onClick={() => handleDeleteDialogOpen(patient)} color="secondary">
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
            count={patients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="pagination"
          />
        </Container>
      </div>
      {user && (
        <AddPatientDialog open={addDialogOpen} onClose={handleAddDialogClose} onPatientAdded={handlePatientAdded} />
      )}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare il paziente {selectedPatient?.nominativo}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Annulla
          </Button>
          <Button
            onClick={() => handleDelete(selectedPatient.uuid)}
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

export default PatientList;
