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
  Link,
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
import AddPatientDialog from './AddPatientDialog';
import EditPatientDialog from './EditPatientDialog';
import BackgroundWrapper from '../../components/BackgroundWrapper'; // Importa BackgroundWrapper
import './PatientList.css';

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '62vm',
  backgroundColor: '#ffffff',
  opacity: 0.9,
});

const StyledTable = styled(Table)({
  minWidth: 650,
  '& .MuiTableCell-head': {
    backgroundColor: '#f1f1f1',
    fontWeight: 'bold',
  },
  '& .MuiTableCell-body': {
    fontSize: 14,
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
  backgroundColor: '#4caf50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#45a049',
  },
});

function PatientList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
      const response = await fetch(`http://localhost:5000/api/patients/bulk_delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ uuids }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

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
        <div className="content">
          <Container component={Paper} className="table-container">
            <Header>
              <IconButton onClick={() => navigate('/main')}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h4" component="h1" gutterBottom>
                Lista Pazienti
              </Typography>
              {user && (
                <AddButton
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddDialogOpen}
                >
                  Aggiungi Paziente
                </AddButton>
              )}
            </Header>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Nominativo</TableCell>
                  <TableCell>Età</TableCell>
                  <TableCell>Altezza</TableCell>
                  <TableCell>Peso</TableCell>
                  <TableCell>Dottore</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
                  <TableRow key={patient.uuid}>
                    <TableCell>
                      <Link component="button" onClick={() => handlePatientInfoOpen(patient)}>
                        {patient.nominativo}
                      </Link>
                    </TableCell>
                    <TableCell>{patient.eta}</TableCell>
                    <TableCell>{patient.altezza}</TableCell>
                    <TableCell>{patient.peso}</TableCell>
                    <TableCell>{patient.doctor_name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditDialogOpen(patient)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteDialogOpen(patient)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={patients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Container>
        </div>
        <AddPatientDialog open={addDialogOpen} onClose={handleAddDialogClose} onPatientAdded={handlePatientAdded} />
        {selectedPatient && (
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
            <Button onClick={() => handleDelete(selectedPatient ? [selectedPatient.uuid] : selectedPatients)} color="primary">
              Elimina
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </BackgroundWrapper>
  );
}

export default PatientList;
