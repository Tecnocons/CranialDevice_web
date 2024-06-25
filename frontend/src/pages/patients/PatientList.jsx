import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import HamburgerMenu from '../../components/HamburgerMenu';
import AddPatientDialog from '../../components/AddPatientDialog';
import './PatientList.css';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchPatients = async () => {
    try {
      const endpoint = user.isAdmin ? '/api/patients' : `/api/patients/assigned?doctor_name=${user.name}`;
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'GET',
        credentials: 'include'
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
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handlePatientAdded = () => {
    setIsDialogOpen(false);
    fetchPatients(); // Ricarica la lista dei pazienti dopo aver aggiunto un nuovo paziente
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          <div className="header">
            <Typography variant="h4" component="h1" gutterBottom>
              Lista Pazienti
            </Typography>
            {!user.isAdmin && (
              <Button className="add-patient-btn" onClick={handleDialogOpen}>
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
                {user.isAdmin && <TableCell className="table-header">Dottore</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={patients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Container>
      </div>
      <AddPatientDialog open={isDialogOpen} onClose={handleDialogClose} onPatientAdded={handlePatientAdded} />
    </div>
  );
}

export default PatientList;
