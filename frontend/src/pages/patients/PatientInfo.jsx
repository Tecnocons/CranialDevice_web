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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cartella Clinica di {patient.nominativo}</DialogTitle>
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
