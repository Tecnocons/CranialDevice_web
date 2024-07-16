import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, IconButton, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import EditIcon from '@mui/icons-material/Edit';
import jsPDF from 'jspdf';
import AssignPathologiesDialog from './AssignPathologiesDialog';
import AssignSymptomsDialog from './AssignSymptomsDialog';
import AssignTraumaticEventsDialog from './AssignTraumaticEventsDialog';
import AssignSurgeriesDialog from './AssignSurgeriesDialog';
import AssignTreatmentsDialog from './AssignTreatmentsDialog';
import EditPatientDialog from './EditPatientDialog';
import StartMeasurement from './StartMeasurement';
import ControlPanel from './ControlPanel';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BuildIcon from '@mui/icons-material/Build';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import './PatientProfile.css';
import { ClipLoader } from 'react-spinners';
import { useLoading } from '../../contexts/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#004ba0',
      light: '#63a4ff',
    },
    secondary: {
      main: '#dc004e',
      dark: '#9a0036',
      light: '#ff616f',
    },
  },
});

const PatientProfile = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading, isLoading } = useLoading();
  const [patient, setPatient] = useState(null);
  const [assignPathologiesDialogOpen, setAssignPathologiesDialogOpen] = useState(false);
  const [assignSymptomsDialogOpen, setAssignSymptomsDialogOpen] = useState(false);
  const [assignTraumaticEventsDialogOpen, setAssignTraumaticEventsDialogOpen] = useState(false);
  const [assignSurgeriesDialogOpen, setAssignSurgeriesDialogOpen] = useState(false);
  const [assignTreatmentsDialogOpen, setAssignTreatmentsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);

  useEffect(() => {
    showLoading();
    const fetchAllData = async () => {
      await fetchPatient();
      hideLoading();
    };

    fetchAllData();
  }, [uuid]);

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
    doc.text('Patologie', 20, 110 + measurements.length * 10);
    doc.setFontSize(12);
    pathologies.forEach((pathology, index) => {
      doc.text(pathology.name, 20, 120 + measurements.length * 10 + index * 10);
    });

    doc.setFontSize(14);
    doc.text('Sintomi', 20, 130 + measurements.length * 10 + pathologies.length * 10);
    doc.setFontSize(12);
    symptoms.forEach((symptom, index) => {
      doc.text(symptom.name, 20, 140 + measurements.length * 10 + pathologies.length * 10 + index * 10);
    });

    doc.setFontSize(14);
    doc.text('Eventi Traumatici', 20, 150 + measurements.length * 10 + pathologies.length * 10 + symptoms.length * 10);
    doc.setFontSize(12);
    traumaticEvents.forEach((event, index) => {
      doc.text(event.name, 20, 160 + measurements.length * 10 + pathologies.length * 10 + symptoms.length * 10 + index * 10);
    });

    doc.setFontSize(14);
    doc.text('Interventi', 20, 170 + measurements.length * 10 + pathologies.length * 10 + symptoms.length * 10 + traumaticEvents.length * 10);
    doc.setFontSize(12);
    surgeries.forEach((surgery, index) => {
      doc.text(surgery.name, 20, 180 + measurements.length * 10 + pathologies.length * 10 + symptoms.length * 10 + traumaticEvents.length * 10 + index * 10);
    });

    doc.setFontSize(14);
    doc.text('Trattamenti', 20, 190 + measurements.length * 10 + pathologies.length * 10 + symptoms.length * 10 + traumaticEvents.length * 10 + surgeries.length * 10);
    doc.setFontSize(12);
    treatments.forEach((treatment, index) => {
      doc.text(treatment.name, 20, 200 + measurements.length * 10 + pathologies.length * 10 + symptoms.length * 10 + traumaticEvents.length * 10 + surgeries.length * 10 + index * 10);
    });

    doc.save(`Cartella_Clinica_${patient.nominativo}.pdf`);
  };

  const getIcon = () => {
    if (!patient) return '👤'; // Placeholder icon if patient is null
    switch (patient.sesso) {
      case 'maschio':
        return '👤'; // Placeholder icon for male
      case 'femmina':
        return '👩'; // Placeholder icon for female
      default:
        return '👤'; // Placeholder icon for other/unspecified
    }
  };

  const handleAssignPathologiesDialogOpen = () => {
    setAssignPathologiesDialogOpen(true);
  };

  const handleAssignPathologiesDialogClose = () => {
    setAssignPathologiesDialogOpen(false);
    fetchPatient(); // Refresh patient data after assignment
  };

  const handleAssignSymptomsDialogOpen = () => {
    setAssignSymptomsDialogOpen(true);
  };

  const handleAssignSymptomsDialogClose = () => {
    setAssignSymptomsDialogOpen(false);
    fetchPatient(); // Refresh patient data after assignment
  };

  const handleAssignTraumaticEventsDialogOpen = () => {
    setAssignTraumaticEventsDialogOpen(true);
  };

  const handleAssignTraumaticEventsDialogClose = () => {
    setAssignTraumaticEventsDialogOpen(false);
    fetchPatient(); // Refresh patient data after assignment
  };

  const handleAssignSurgeriesDialogOpen = () => {
    setAssignSurgeriesDialogOpen(true);
  };

  const handleAssignSurgeriesDialogClose = () => {
    setAssignSurgeriesDialogOpen(false);
    fetchPatient(); // Refresh patient data after assignment
  };

  const handleAssignTreatmentsDialogOpen = () => {
    setAssignTreatmentsDialogOpen(true);
  };

  const handleAssignTreatmentsDialogClose = () => {
    setAssignTreatmentsDialogOpen(false);
    fetchPatient(); // Refresh patient data after assignment
  };

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    fetchPatient(); // Refresh patient data
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

      setPatient(updatedPatient);
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="patient-info-container">
        <IconButton onClick={() => navigate(-1)} className="back-button">
          <ArrowBackIcon />
        </IconButton>
        <Grid container spacing={3}>
          <Grid item xs={12} className="patient-header">
            <div className="patient-icon">{getIcon()}</div>
            <div className="patient-details">
              {patient ? (
                <>
                  <Typography variant="h4">{patient.nominativo}</Typography>
                  <Typography variant="body1">Età: {patient.eta}</Typography>
                  <Typography variant="body1">Altezza: {patient.altezza}</Typography>
                  <Typography variant="body1">Peso: {patient.peso}</Typography>
                  <Typography variant="body1">Sesso: {patient.sesso}</Typography>
                  <IconButton onClick={handleEditDialogOpen} className="edit-button">
                    <EditIcon />
                  </IconButton>
                  <StartMeasurement patientId={uuid} deviceId={patient.device_id} />
                  <Button variant="contained" color="primary" onClick={() => setShowMeasurements(true)}>
                    Vedi Misurazioni
                  </Button>
                </>
              ) : (
                <Typography variant="body1">Loading...</Typography>
              )}
            </div>
            <IconButton onClick={generatePDF} className="pdf-button">
              <SaveAltIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="info-block" onClick={handleAssignPathologiesDialogOpen}>
              <div className="info-block-content">
                <div className="info-block-icon" style={{ backgroundColor: '#FFCDD2' }}>
                  <MedicalServicesIcon />
                </div>
                <Typography variant="h6" className="box-title">Patologie</Typography>
                <ArrowForwardIosIcon className="info-block-arrow" />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="info-block" onClick={handleAssignSymptomsDialogOpen}>
              <div className="info-block-content">
                <div className="info-block-icon" style={{ backgroundColor: '#C8E6C9' }}>
                  <HealingIcon />
                </div>
                <Typography variant="h6" className="box-title">Sintomi</Typography>
                <ArrowForwardIosIcon className="info-block-arrow" />
              </div>
            </Paper>
            </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="info-block" onClick={handleAssignTraumaticEventsDialogOpen}>
              <div className="info-block-content">
                <div className="info-block-icon" style={{ backgroundColor: '#FFE082' }}>
                  <ReportProblemIcon />
                </div>
                <Typography variant="h6" className="box-title">Eventi Traumatici</Typography>
                <ArrowForwardIosIcon className="info-block-arrow" />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="info-block" onClick={handleAssignSurgeriesDialogOpen}>
              <div className="info-block-content">
                <div className="info-block-icon" style={{ backgroundColor: '#FFAB91' }}>
                  <BuildIcon />
                </div>
                <Typography variant="h6" className="box-title">Interventi</Typography>
                <ArrowForwardIosIcon className="info-block-arrow" />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="info-block" onClick={handleAssignTreatmentsDialogOpen}>
              <div className="info-block-content">
                <div className="info-block-icon" style={{ backgroundColor: '#B3E5FC' }}>
                  <LocalHospitalIcon />
                </div>
                <Typography variant="h6" className="box-title">Trattamenti</Typography>
                <ArrowForwardIosIcon className="info-block-arrow" />
              </div>
            </Paper>
          </Grid>
        </Grid>
        {showMeasurements && (
          <ControlPanel open={showMeasurements} onClose={() => setShowMeasurements(false)} patientId={uuid} />
        )}
        <AssignPathologiesDialog open={assignPathologiesDialogOpen} onClose={handleAssignPathologiesDialogClose} />
        <AssignSymptomsDialog open={assignSymptomsDialogOpen} onClose={handleAssignSymptomsDialogClose} />
        <AssignTraumaticEventsDialog open={assignTraumaticEventsDialogOpen} onClose={handleAssignTraumaticEventsDialogClose} />
        <AssignSurgeriesDialog open={assignSurgeriesDialogOpen} onClose={handleAssignSurgeriesDialogClose} />
        <AssignTreatmentsDialog open={assignTreatmentsDialogOpen} onClose={handleAssignTreatmentsDialogClose} />
        <EditPatientDialog open={editDialogOpen} onClose={handleEditDialogClose} onSubmit={handleEditSubmit} patient={patient} />
      </Container>
    </ThemeProvider>
  );
};

export default PatientProfile;

