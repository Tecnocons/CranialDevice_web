import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import jsPDF from 'jspdf';
import './PatientInfo.css';

const PatientInfo = ({ open, onClose, patient }) => {
  const measurements = [
    { date: '2024-06-20', value: '120/80' },
    { date: '2024-06-21', value: '125/85' },
  ];

  const treatments = [
    { date: '2024-06-20', description: 'Antibiotics' },
    { date: '2024-06-21', description: 'Physical Therapy' },
  ];

  const pathologies = [
    { name: 'Hypertension' },
    { name: 'Diabetes' },
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

    doc.setFontSize(14);
    doc.text('Misurazioni', 20, 80);
    doc.setFontSize(12);
    measurements.forEach((measurement, index) => {
      doc.text(`${measurement.date}: ${measurement.value}`, 20, 90 + index * 10);
    });

    doc.setFontSize(14);
    doc.text('Trattamenti', 20, 100 + measurements.length * 10);
    doc.setFontSize(12);
    treatments.forEach((treatment, index) => {
      doc.text(`${treatment.date}: ${treatment.description}`, 20, 110 + measurements.length * 10 + index * 10);
    });

    doc.setFontSize(14);
    doc.text('Patologie', 20, 120 + measurements.length * 10 + treatments.length * 10);
    doc.setFontSize(12);
    pathologies.forEach((pathology, index) => {
      doc.text(pathology.name, 20, 130 + measurements.length * 10 + treatments.length * 10 + index * 10);
    });

    doc.save(`Cartella_Clinica_${patient.nominativo}.pdf`);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Cartella Clinica di {patient.nominativo}
        <IconButton onClick={generatePDF} style={{ float: 'right' }}>
          <SaveAltIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Informazioni del Paziente</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Nome: {patient.nominativo}</Typography>
            <Typography>Età: {patient.eta}</Typography>
            <Typography>Altezza: {patient.altezza}</Typography>
            <Typography>Peso: {patient.peso}</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Misurazioni</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {measurements.map((measurement, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${measurement.date}: ${measurement.value}`} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Trattamenti</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {treatments.map((treatment, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${treatment.date}: ${treatment.description}`} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Patologie</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {pathologies.map((pathology, index) => (
                <ListItem key={index}>
                  <ListItemText primary={pathology.name} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Chiudi</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientInfo;
