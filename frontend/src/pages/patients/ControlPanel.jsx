import React, { useState } from 'react';
import { Typography, Dialog, DialogContent, IconButton, Grid, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Importa un'icona adatta
import StartMeasurement from './StartMeasurement';
import MeasurementsTable from './MeasurementsTable';
import MobilityIndexChart from './MobilityIndexChart';
import LatestMeasurementChart from './LatestMeasurementChart';
import './ControlPanel.css';

const ControlPanel = ({ open, onClose, patientId }) => {
  const [activeDialog, setActiveDialog] = useState(null);
  const [measurementDialogOpen, setMeasurementDialogOpen] = useState(false);

  const handleOpenMeasurementsTable = () => setActiveDialog('measurementsTable');
  const handleOpenMobilityIndexChart = () => setActiveDialog('mobilityIndexChart');
  const handleOpenLatestMeasurementChart = () => setActiveDialog('latestMeasurementChart');
  const handleCloseDialog = () => setActiveDialog(null);

  const handleOpenMeasurementDialog = () => setMeasurementDialogOpen(true);
  const handleCloseMeasurementDialog = () => setMeasurementDialogOpen(false);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper className="control-panel-box" onClick={handleOpenMeasurementsTable} style={{ cursor: 'pointer' }}>
              <AssessmentIcon className="control-panel-icon" />
              <Typography variant="h6">Visualizza Misurazioni</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className="control-panel-box" onClick={handleOpenMobilityIndexChart} style={{ cursor: 'pointer' }}>
              <DirectionsRunIcon className="control-panel-icon" />
              <Typography variant="h6">Indice di Mobilità</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className="control-panel-box" onClick={handleOpenLatestMeasurementChart} style={{ cursor: 'pointer' }}>
              <ShowChartIcon className="control-panel-icon" />
              <Typography variant="h6">Ultima Misurazione</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className="control-panel-box" onClick={handleOpenMeasurementDialog} style={{ cursor: 'pointer' }}>
              <PlayArrowIcon className="control-panel-icon" />
              <Typography variant="h6">Inizia Misurazione</Typography>
            </Paper>
          </Grid>
        </Grid>

        {activeDialog === 'measurementsTable' && (
          <MeasurementsTable open={true} onClose={handleCloseDialog} patientId={patientId} />
        )}
        {activeDialog === 'mobilityIndexChart' && (
          <MobilityIndexChart open={true} onClose={handleCloseDialog} patientId={patientId} />
        )}
        {activeDialog === 'latestMeasurementChart' && (
          <LatestMeasurementChart open={true} onClose={handleCloseDialog} patientId={patientId} />
        )}
        <StartMeasurement open={measurementDialogOpen} onClose={handleCloseMeasurementDialog} patientId={patientId} />
      </DialogContent>
    </Dialog>
  );
};

export default ControlPanel;
