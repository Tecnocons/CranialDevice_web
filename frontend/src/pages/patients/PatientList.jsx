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
import AddPatientDialog from './AddPatientDialog';
import EditPatientDialog from './EditPatientDialog';
import { useNavigate } from 'react-router-dom';
import './PatientList.css';
import HamburgerMenu from '../../components/HamburgerMenu';

function PatientList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState([]);

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

  const handleDelete = async (uuids) => {
    try {
      console.log(`Deleting patients with UUIDs: ${uuids}`); // Log UUIDs being sent for deletion

      const response = await fetch(`http://localhost:5000/api/patients/bulk_delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ uuids }),  // Assicurati che i dati siano inviati come JSON
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

      // Aggiorna la lista dei pazienti dopo la cancellazione
      setPatients((prevPatients) => prevPatients.filter((patient) => !uuids.includes(patient.uuid)));
      setDeleteDialogOpen(false);
      setSelectedPatients([]);
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

  const handleEditDialogOpen = (patient) => {
    setSelectedPatient(patient);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleEditSubmit = async (updatedPatient) => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedPatient),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Aggiorna la lista dei pazienti dopo la modifica
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.uuid === updatedPatient.uuid ? { ...patient, ...updatedPatient } : patient
        )
      );
      setEditDialogOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error updating patient:', error.message);
    }
  };

  const handleDeleteDialogOpen = (patient) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleSelectPatient = (uuid) => {
    if (selectedPatients.includes(uuid)) {
      setSelectedPatients(selectedPatients.filter((id) => id !== uuid));
    } else {
      setSelectedPatients([...selectedPatients, uuid]);
    }
  };

  const isSelected = (uuid) => selectedPatients.includes(uuid);

  const handleSelectAllPatients = (event) => {
    if (event.target.checked) {
      const newSelecteds = patients.map((patient) => patient.uuid);
      setSelectedPatients(newSelecteds);
    } else {
      setSelectedPatients([]);
    }
  };

  const isAllSelected = selectedPatients.length === patients.length;

  const handleMultipleDelete = () => {
    setDeleteDialogOpen(true);
    setSelectedPatient(null);
  };

  const handlePatientInfoOpen = (patient) => {
    navigate(`/patients/${patient.uuid}`);
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
            {user && !user.isAdmin && selectedPatients.length > 0 && (
              <Button color="secondary" onClick={handleMultipleDelete}>
                Elimina Selezionati
              </Button>
            )}
          </div>
          <Table className="styled-table">
            <TableHead>
              <TableRow>
                {user && !user.isAdmin && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedPatients.length > 0 && selectedPatients.length < patients.length}
                      checked={isAllSelected}
                      onChange={handleSelectAllPatients}
                    />
                  </TableCell>
                )}
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
                <TableRow
                  key={patient.uuid}
                  hover
                  role="checkbox"
                  aria-checked={isSelected(patient.uuid)}
                  selected={isSelected(patient.uuid)}
                >
                  {user && !user.isAdmin && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(patient.uuid)}
                        onChange={() => handleSelectPatient(patient.uuid)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Link component="button" onClick={() => handlePatientInfoOpen(patient)}>
                      {patient.nominativo}
                    </Link>
                  </TableCell>
                  <TableCell>{patient.eta}</TableCell>
                  <TableCell>{patient.altezza}</TableCell>
                  <TableCell>{patient.peso}</TableCell>
                  {user && user.isAdmin && <TableCell>{patient.doctor_name}</TableCell>}
                  {user && !user.isAdmin && (
                    <TableCell>
                      <IconButton onClick={() => handleEditDialogOpen(patient)} color="primary" disabled={selectedPatients.length > 0}>
                        <EditIcon />
                      </IconButton>
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
      {user && selectedPatient && (
        <EditPatientDialog
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          onEditSubmit={handleEditSubmit}
          patient={selectedPatient}
        />
      )}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedPatient
              ? `Sei sicuro di voler eliminare il paziente ${selectedPatient.nominativo}?`
              : 'Sei sicuro di voler eliminare i pazienti selezionati?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Annulla
          </Button>
          <Button
            onClick={() => handleDelete(selectedPatient ? [selectedPatient.uuid] : selectedPatients)}
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
