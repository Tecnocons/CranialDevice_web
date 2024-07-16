import React, { useState } from 'react';
import { Typography, Dialog, DialogContent, IconButton, Grid, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MeasurementsTable from './MeasurementsTable';
import MobilityIndexChart from './MobilityIndexChart';
import LatestMeasurementChart from './LatestMeasurementChart';
import './ControlPanel.css';

const ControlPanel = ({ open, onClose, patientId }) => {
  const [showMeasurementsTable, setShowMeasurementsTable] = useState(false);
  const [showMobilityIndexChart, setShowMobilityIndexChart] = useState(false);
  const [showLatestMeasurementChart, setShowLatestMeasurementChart] = useState(false);

  const handleOpenMeasurementsTable = () => {
    setShowMeasurementsTable(true);
    setShowMobilityIndexChart(false);
    setShowLatestMeasurementChart(false);
  };

  const handleOpenMobilityIndexChart = () => {
    setShowMeasurementsTable(false);
    setShowMobilityIndexChart(true);
    setShowLatestMeasurementChart(false);
  };

  const handleOpenLatestMeasurementChart = () => {
    setShowMeasurementsTable(false);
    setShowMobilityIndexChart(false);
    setShowLatestMeasurementChart(true);
  };

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
        </Grid>

        {showMeasurementsTable && <MeasurementsTable patientId={patientId} />}
        {showMobilityIndexChart && <MobilityIndexChart patientId={patientId} />}
        {showLatestMeasurementChart && <LatestMeasurementChart patientId={patientId} />}
      </DialogContent>
    </Dialog>
  );
};

export default ControlPanel;
