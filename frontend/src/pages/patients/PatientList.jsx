import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import HamburgerMenu from '../../components/HamburgerMenu';
import AddPatientDialog from '../../components/AddPatientDialog';
import './PatientList.css';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPatients = async () => {
    try {
      const endpoint = user.isAdmin ? '/api/patients' : `/api/patients/assigned?doctor_name=${user.name}`;
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'GET',
        credentials: 'include'  // Includi le credenziali
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

  useEffect(() => {
    fetchPatients();
  }, [user.isAdmin, user.name]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handlePatientAdded = () => {
    fetchPatients();
  };

  if (loading) {
    return <div className="root"><Typography>Loading...</Typography></div>;
  }

  if (error) {
    return <div className="root"><Typography>Error: {error}</Typography></div>;
  }

  return (
    <div className="root">
      <HamburgerMenu />
      <div className="content">
        <Container component={Paper}>
          <Typography variant="h4" gutterBottom>
            Lista Pazienti
          </Typography>
          {user && !user.isAdmin && (
            <Button variant="contained" color="primary" onClick={handleDialogOpen} style={{ marginBottom: '16px' }}>
              Aggiungi Paziente
            </Button>
          )}
          <Table className="styled-table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header">Nominativo</TableCell>
                <TableCell className="table-header">Età</TableCell>
                <TableCell className="table-header">Altezza</TableCell>
                <TableCell className="table-header">Peso</TableCell>
                {user.isAdmin && <TableCell className="table-header">Dottore</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.uuid}>
                  <TableCell>{patient.nominativo}</TableCell>
                  <TableCell>{patient.eta}</TableCell>
                  <TableCell>{patient.altezza}</TableCell>
                  <TableCell>{patient.peso}</TableCell>
                  {user.isAdmin && <TableCell>{patient.doctor_name}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </div>
      <AddPatientDialog open={dialogOpen} onClose={handleDialogClose} onPatientAdded={handlePatientAdded} />
    </div>
  );
}

export default PatientList;
