import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import EditIcon from '@mui/icons-material/Edit';
import jsPDF from 'jspdf';
import AssignPathologiesDialog from './AssignPathologiesDialog';
import AssignSymptomsDialog from './AssignSymptomsDialog';
import AssignTraumaticEventsDialog from './AssignTraumaticEventsDialog';
import AssignSurgeriesDialog from './AssignSurgeriesDialog';
import AssignTreatmentsDialog from './AssignTreatmentsDialog';
import EditPatientDialog from './EditPatientDialog';
import StartMeasurement from './StartMeasurement'; // Import the new component
import './PatientProfile.css';
import { ClipLoader } from 'react-spinners';
import { useLoading } from '../../contexts/AuthContext'; // Import the loading context

const PatientProfile = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading, isLoading } = useLoading(); // Use the loading context
  const [patient, setPatient] = useState(null);
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

  useEffect(() => {
    showLoading(); // Show loading spinner when fetching data
    const fetchAllData = async () => {
      await fetchPatient();
      await fetchPathologies();
      await fetchSymptoms();
      await fetchTraumaticEvents();
      await fetchSurgeries();
      await fetchTreatments();
      hideLoading(); // Hide loading spinner when data fetching is complete
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

  const fetchSymptoms = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patient_symptom/${uuid}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSymptoms(data);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    }
  };

  const fetchTraumaticEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patient_traumatic_event/${uuid}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTraumaticEvents(data);
    } catch (error) {
      console.error('Error fetching traumatic events:', error);
    }
  };

  const fetchSurgeries = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patient_surgery/${uuid}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSurgeries(data);
    } catch (error) {
      console.error('Error fetching surgeries:', error);
    }
  };

  const fetchTreatments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patient_treatment/${uuid}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTreatments(data);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <ClipLoader size={50} color={'#123abc'} loading={isLoading} />
      </div>
    );
  }

  const measurements = [
    { date: '2024-06-20', value: '120/80' },
    { date: '2024-06-21', value: '125/85' },
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
    fetchPathologies(); // Refresh pathologies after assignment
  };

  const handleAssignSymptomsDialogOpen = () => {
    setAssignSymptomsDialogOpen(true);
  };

  const handleAssignSymptomsDialogClose = () => {
    setAssignSymptomsDialogOpen(false);
    fetchSymptoms(); // Refresh symptoms after assignment
  };

  const handleAssignTraumaticEventsDialogOpen = () => {
    setAssignTraumaticEventsDialogOpen(true);
  };

  const handleAssignTraumaticEventsDialogClose = () => {
    setAssignTraumaticEventsDialogOpen(false);
    fetchTraumaticEvents(); // Refresh traumatic events after assignment
  };

  const handleAssignSurgeriesDialogOpen = () => {
    setAssignSurgeriesDialogOpen(true);
  };

  const handleAssignSurgeriesDialogClose = () => {
    setAssignSurgeriesDialogOpen(false);
    fetchSurgeries(); // Refresh surgeries after assignment
  };

  const handleAssignTreatmentsDialogOpen = () => {
    setAssignTreatmentsDialogOpen(true);
  };

  const handleAssignTreatmentsDialogClose = () => {
    setAssignTreatmentsDialogOpen(false);
    fetchTreatments(); // Refresh treatments after assignment
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
      console.error('Error updating patient:', error.message);
    }
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
                <StartMeasurement deviceId={patient.device_id} /> {/* Add the StartMeasurement component */}
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
          <Paper className="info-block">
            <Typography variant="h6" className="box-title">Misurazioni</Typography>
            <div className="info-content">
              {measurements.map((measurement, index) => (
                <Typography key={index}>{`${measurement.date}: ${measurement.value}`}</Typography>
              ))}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="info-block">
            <Typography variant="h6" className="box-title">Patologie</Typography>
            <div className="info-content">
              {pathologies.map((pathology, index) => (
                <Typography key={index}>{pathology.name}</Typography>
              ))}
            </div>
            <Button variant="contained" color="primary" onClick={handleAssignPathologiesDialogOpen}>
              Assegna Patologie
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="info-block">
            <Typography variant="h6" className="box-title">Sintomi</Typography>
            <div className="info-content">
              {symptoms.map((symptom, index) => (
                <Typography key={index}>{symptom.name}</Typography>
              ))}
            </div>
            <Button variant="contained" color="primary" onClick={handleAssignSymptomsDialogOpen}>
              Assegna Sintomi
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="info-block">
            <Typography variant="h6" className="box-title">Eventi Traumatici</Typography>
            <div className="info-content">
              {traumaticEvents.map((event, index) => (
                <Typography key={index}>{event.name}</Typography>
              ))}
            </div>
            <Button variant="contained" color="primary" onClick={handleAssignTraumaticEventsDialogOpen}>
              Assegna Eventi Traumatici
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="info-block">
            <Typography variant="h6" className="box-title">Interventi</Typography>
            <div className="info-content">
              {surgeries.map((surgery, index) => (
                <Typography key={index}>{surgery.name}</Typography>
              ))}
            </div>
            <Button variant="contained" color="primary" onClick={handleAssignSurgeriesDialogOpen}>
              Assegna Interventi
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="info-block">
            <Typography variant="h6" className="box-title">Trattamenti</Typography>
            <div className="info-content">
              {treatments.map((treatment, index) => (
                <Typography key={index}>{treatment.name}</Typography>
              ))}
            </div>
            <Button variant="contained" color="primary" onClick={handleAssignTreatmentsDialogOpen}>
              Assegna Trattamenti
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <AssignPathologiesDialog
        open={assignPathologiesDialogOpen}
        onClose={handleAssignPathologiesDialogClose}
        patient={patient}
        onAssign={fetchPathologies}
      />
      <AssignSymptomsDialog
        open={assignSymptomsDialogOpen}
        onClose={handleAssignSymptomsDialogClose}
        patient={patient}
        onAssign={fetchSymptoms}
      />
      <AssignTraumaticEventsDialog
        open={assignTraumaticEventsDialogOpen}
        onClose={handleAssignTraumaticEventsDialogClose}
        patient={patient}
        onAssign={fetchTraumaticEvents}
      />
      <AssignSurgeriesDialog
        open={assignSurgeriesDialogOpen}
        onClose={handleAssignSurgeriesDialogClose}
        patient={patient}
        onAssign={fetchSurgeries}
      />
      <AssignTreatmentsDialog
        open={assignTreatmentsDialogOpen}
        onClose={handleAssignTreatmentsDialogClose}
        patient={patient}
        onAssign={fetchTreatments}
      />
      <EditPatientDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        onEditSubmit={handleEditSubmit}
        patient={patient}
      />
    </Container>
  );
};

export default PatientProfile;
