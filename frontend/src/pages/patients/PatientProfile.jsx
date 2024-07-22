import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, IconButton, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Widgets';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import AssignPathologiesDialog from './AssignPathologiesDialog';
import AssignSymptomsDialog from './AssignSymptomsDialog';
import AssignTraumaticEventsDialog from './AssignTraumaticEventsDialog';
import AssignSurgeriesDialog from './AssignSurgeriesDialog';
import AssignTreatmentsDialog from './AssignTreatmentsDialog';
import EditPatientDialog from './EditPatientDialog';
import ControlPanel from './ControlPanel';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BuildIcon from '@mui/icons-material/Build';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import generatePDF from './GeneratePdf';
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
  const [measurements, setMeasurements] = useState([]);
  const [pathologies, setPathologies] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [traumaticEvents, setTraumaticEvents] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [treatments, setTreatments] = useState([]);
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
      await fetchAdditionalData();
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

  const fetchAdditionalData = async () => {
    try {
      const [pathologiesRes, symptomsRes, traumaticEventsRes, surgeriesRes, treatmentsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/patient_pathology/${uuid}`, { credentials: 'include' }),
        fetch(`http://localhost:5000/api/patient_symptom/${uuid}`, { credentials: 'include' }),
        fetch(`http://localhost:5000/api/patient_traumatic_event/${uuid}`, { credentials: 'include' }),
        fetch(`http://localhost:5000/api/patient_surgery/${uuid}`, { credentials: 'include' }),
        fetch(`http://localhost:5000/api/patient_treatment/${uuid}`, { credentials: 'include' }),
      ]);

      const [pathologiesData, symptomsData, traumaticEventsData, surgeriesData, treatmentsData] = await Promise.all([
        pathologiesRes.json(),
        symptomsRes.json(),
        traumaticEventsRes.json(),
        surgeriesRes.json(),
        treatmentsRes.json(),
      ]);

      setPathologies(pathologiesData);
      setSymptoms(symptomsData);
      setTraumaticEvents(traumaticEventsData);
      setSurgeries(surgeriesData);
      setTreatments(treatmentsData);
    } catch (error) {
      console.error('Error fetching additional data:', error);
    }
  };

  const handleEditSubmit = async (updatedPatient) => {
    try {
      const updatedPatientWithUuid = {
        ...updatedPatient,
        uuid: patient.uuid // Assicurati che l'UUID sia incluso
      };
      const response = await fetch(`http://localhost:5000/api/patients`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedPatientWithUuid),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setPatient(updatedPatientWithUuid);
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating patient:', error);
    }
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

  return (
    <ThemeProvider theme={theme}>
      <Container className="patient-info-container">
        <Grid container spacing={3}>
          <Grid item xs={12} className="back-button-container">
            <IconButton onClick={() => navigate(-1)} className="back-button">
              <ArrowBackIcon />
            </IconButton>
          </Grid>
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
                  <IconButton onClick={() => generatePDF(patient, measurements, pathologies, symptoms, traumaticEvents, surgeries, treatments)} className="pdf-button">
                    <SaveAltIcon />
                  </IconButton>
                </>
              ) : (
                <Typography variant="body1">Loading...</Typography>
              )}
            </div>
          </Grid>
          <Grid item xs={12} className="center">
            <IconButton className="settings-container" onClick={() => setShowMeasurements(true)}>
              <SettingsIcon className="settings-icon" />
              <Typography variant="h6" className="settings-label">Gestisci</Typography>
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
        <AssignPathologiesDialog
          open={assignPathologiesDialogOpen}
          onClose={handleAssignPathologiesDialogClose}
          patient={patient}
          onAssign={fetchPatient}
        />
        <AssignSymptomsDialog
          open={assignSymptomsDialogOpen}
          onClose={handleAssignSymptomsDialogClose}
          patient={patient}
          onAssign={fetchPatient}
        />
        <AssignTraumaticEventsDialog
          open={assignTraumaticEventsDialogOpen}
          onClose={handleAssignTraumaticEventsDialogClose}
          patient={patient}
          onAssign={fetchPatient}
        />
        <AssignSurgeriesDialog
          open={assignSurgeriesDialogOpen}
          onClose={handleAssignSurgeriesDialogClose}
          patient={patient}
          onAssign={fetchPatient}
        />
        <AssignTreatmentsDialog
          open={assignTreatmentsDialogOpen}
          onClose={handleAssignTreatmentsDialogClose}
          patient={patient}
          onAssign={fetchPatient}
        />
        <EditPatientDialog
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          onEditSubmit={handleEditSubmit}
          patient={patient}
        />
      </Container>
    </ThemeProvider>
  );
};

export default PatientProfile;

