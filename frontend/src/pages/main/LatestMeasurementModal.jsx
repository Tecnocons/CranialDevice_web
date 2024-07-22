import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Line } from 'react-chartjs-2';

const LatestMeasurementModal = ({ open, handleClose, uuid }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (open) {
      fetchLatestMeasurement();
    }
  }, [open]);

  const fetchLatestMeasurement = async () => {
    if (!uuid) {
      console.error('User ID is missing');
      return;
    }
  
    try {
      // Fetch all measurements for the doctor's patients
      const measurementResponse = await fetch(`http://localhost:5000/api/doctor_measurements/${uuid}`, {
        method: 'GET',
        credentials: 'include',
      });
      const measurements = await measurementResponse.json();
  
      // Find the latest measurement_id among all patients
      const latestMeasurement = measurements.reduce((latest, current) => {
        if (!latest || new Date(current.timestamp) > new Date(latest.timestamp)) {
          return current;
        }
        return latest;
      }, null);
  
      if (!latestMeasurement) {
        setChartData({});
        return;
      }
  
      // Filter measurements by the latest measurement_id
      const latestMeasurementId = latestMeasurement.measurement_id;
      const latestMeasurements = measurements.filter(measurement => measurement.measurement_id === latestMeasurementId);
  
      // Prepare the chart data
      const labels = latestMeasurements.map(measurement => new Date(measurement.timestamp).toLocaleString());
      const spostamentoData = latestMeasurements.map(measurement => measurement.spostamento_mm);
      const forzaData = latestMeasurements.map(measurement => measurement.forza_n);
      const pressioneData = latestMeasurements.map(measurement => measurement.pressione_bar);
      const contropressioneData = latestMeasurements.map(measurement => measurement.contropressione_bar);
  
      const data = {
        labels,
        datasets: [
          {
            label: 'Spostamento (mm)',
            data: spostamentoData,
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Forza (N)',
            data: forzaData,
            borderColor: 'rgba(192,75,75,1)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Pressione (bar)',
            data: pressioneData,
            borderColor: 'rgba(75,75,192,1)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Contropressione (bar)',
            data: contropressioneData,
            borderColor: 'rgba(75,192,75,1)',
            borderWidth: 2,
            fill: false,
          },
        ],
      };
  
      setChartData(data);
    } catch (error) {
      console.error('Error fetching latest measurement:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Ultima Misurazione
        <IconButton onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {chartData.labels ? (
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        ) : (
          <Typography variant="body1">Nessuna misurazione trovata.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LatestMeasurementModal;
