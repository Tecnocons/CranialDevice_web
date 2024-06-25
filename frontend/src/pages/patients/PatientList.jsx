// src/pages/patients/PatientList.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import HamburgerMenu from '../../components/HamburgerMenu';
import './PatientList.css';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const endpoint = user.isAdmin ? '/api/patients' : `/api/patients/assigned?doctor_name=${user.name}`;
        const response = await fetch(`http://localhost:5000${endpoint}`);
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
  }, [user.isAdmin, user.name]);

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
    </div>
  );
}

export default PatientList;
