// src/pages/patients/PatientList.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import HamburgerMenu from '../../components/HamburgerMenu';
import './PatientList.css'; // Importa il file CSS

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patients');
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
  }, []);

  if (loading) {
    return <div className="table-container"><Typography>Loading...</Typography></div>;
  }

  if (error) {
    return <div className="table-container"><Typography>Error: {error}</Typography></div>;
  }

  return (
    <div className="root">
      <HamburgerMenu />
      <div className="table-container">
        <Container component={Paper}>
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell>Nominativo</TableCell>
                <TableCell>Età</TableCell>
                <TableCell>Altezza</TableCell>
                <TableCell>Peso</TableCell>
                <TableCell>Dottore</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.uuid}>
                  <TableCell>{patient.nominativo}</TableCell>
                  <TableCell>{patient.eta}</TableCell>
                  <TableCell>{patient.altezza}</TableCell>
                  <TableCell>{patient.peso}</TableCell>
                  <TableCell>{patient.doctor_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </div>
    </div>
  );
}

export default PatientList;
