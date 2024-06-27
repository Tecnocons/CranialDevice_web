import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import jsPDF from 'jspdf';
import AssignPathologiesDialog from './AssignPathologiesDialog';
import './PatientProfile.css';

const PatientProfile = () => {
  const { uuid } = useParams(); // Ottieni l'UUID dai parametri della rotta
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [pathologies, setPathologies] = useState([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const fetchPathologies = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patient_pathology/${uuid}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPathologies(data);
    } catch (error) {
      console.error('Error fetching pathologies:', error);
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${uuid}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };

    fetchPatient();
    fetchPathologies();
  }, [uuid]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const measurements = [
    { date: '2024-06-20', value: '120/80' },
    { date: '2024-06-21', value: '125/85' },
  ];

  const treatments = [
    { date: '2024-06-20', description: 'Antibiotics' },
    { date: '2024-06-21', description: 'Physical Therapy' },
  ];

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Cartella Clinica di ${patient.nominativo}`, 20, 20);

    doc.setFontSize(14);
    doc.text('Informazioni del Paziente', 20, 30);
    doc.setFontSize(12);
    doc.text(`Nome: ${patient.nominativo}`, 20, 40);
    doc.text(`Età: ${patient.eta}`, 20, 50);
    doc.text(`Altezza: ${patient.altezza}`, 20, 60);
    doc.text(`Peso: ${patient.peso}`, 20, 70);
    doc.text(`Sesso: ${patient.sesso}`, 20, 80);

    doc.setFontSize(14);
    doc.text('Misurazioni', 20, 90);
    doc.setFontSize(12);
    measurements.forEach((measurement, index) => {
      doc.text(`${measurement.date}: ${measurement.value}`, 20, 100 + index * 10);
    });

    doc.setFontSize(14);
    doc.text('Trattamenti', 20, 110 + measurements.length * 10);
    doc.setFontSize(12);
    treatments.forEach((treatment, index) => {
      doc.text(`${treatment.date}: ${treatment.description}`, 20, 120 + measurements.length * 10 + index * 10);
    });

    doc.setFontSize(14);
    doc.text('Patologie', 20, 130 + measurements.length * 10 + treatments.length * 10);
    doc.setFontSize(12);
    pathologies.forEach((pathology, index) => {
      doc.text(pathology.name, 20, 140 + measurements.length * 10 + treatments.length * 10 + index * 10);
    });

    doc.save(`Cartella_Clinica_${patient.nominativo}.pdf`);
  };

  const getIcon = () => {
    switch (patient.sesso) {
      case 'maschio':
        return '👤'; // Placeholder icon for male
      case 'femmina':
        return '👩'; // Placeholder icon for female
      default:
        return '👤'; // Placeholder icon for other/unspecified
    }
  };

  const handleAssignDialogOpen = () => {
    setAssignDialogOpen(true);
  };

  const handleAssignDialogClose = () => {
    setAssignDialogOpen(false);
    fetchPathologies(); // Refresh pathologies after assignment
  };

  return (
    <Container className="patient-info-container">
      <IconButton onClick={() => navigate(-1)} className="back-button">
        <ArrowBackIcon />
      </IconButton>
      <Grid container spacing={3}>
        <Grid item xs={12} className="patient-header">
          <div className="patient-icon">{getIcon()}</div>
          <div className="patient-details">
            <Typography variant="h4">{patient.nominativo}</Typography>
            <Typography variant="body1">Età: {patient.eta}</Typography>
            <Typography variant="body1">Altezza: {patient.altezza}</Typography>
            <Typography variant="body1">Peso: {patient.peso}</Typography>
            <Typography variant="body1">Sesso: {patient.sesso}</Typography>
          </div>
          <IconButton onClick={generatePDF} className="pdf-button">
            <SaveAltIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="info-block">
            <Typography variant="h6">Informazioni del Paziente</Typography>
            <Typography>Nome: {patient.nominativo}</Typography>
            <Typography>Età: {patient.eta}</Typography>
            <Typography>Altezza: {patient.altezza}</Typography>
            <Typography>Peso: {patient.peso}</Typography>
            <Typography>Sesso: {patient.sesso}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="info-block">
            <Typography variant="h6">Misurazioni</Typography>
            {measurements.map((measurement, index) => (
              <Typography key={index}>{`${measurement.date}: ${measurement.value}`}</Typography>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="info-block">
            <Typography variant="h6">Trattamenti</Typography>
            {treatments.map((treatment, index) => (
              <Typography key={index}>{`${treatment.date}: ${treatment.description}`}</Typography>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="info-block">
            <Typography variant="h6">Patologie</Typography>
            {pathologies.map((pathology, index) => (
              <Typography key={index}>{pathology.name}</Typography>
            ))}
            <Button variant="contained" color="primary" onClick={handleAssignDialogOpen}>
              Assegna Patologie
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <AssignPathologiesDialog
        open={assignDialogOpen}
        onClose={handleAssignDialogClose}
        patient={patient}
        onAssign={fetchPathologies}
      />
    </Container>
  );
};

export default PatientProfile;
