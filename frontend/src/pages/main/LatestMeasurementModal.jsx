import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';

const LatestMeasurementModal = ({ open, handleClose }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { data: [], label: 'Forza (N)', borderColor: 'rgba(75,192,192,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Spostamento (mm)', borderColor: 'rgba(192,75,75,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Pressione (bar)', borderColor: 'rgba(75,75,192,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Contropressione (bar)', borderColor: 'rgba(75,192,75,1)', borderWidth: 2, fill: false },
    ]
  });

  useEffect(() => {
    if (open) {
      const fetchLatestMeasurement = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/measurements/latest', {
            method: 'GET',
            credentials: 'include',
          });
          const latestMeasurement = await response.json();
          const measurementId = latestMeasurement.measurement_id;

          const responseAll = await fetch(`http://localhost:5000/api/measurements/by_measurement_id/${measurementId}`, {
            method: 'GET',
            credentials: 'include',
          });
          const data = await responseAll.json();

          const labels = data.map((measurement) => new Date(measurement.timestamp).toLocaleTimeString());
          const forzaData = data.map((measurement) => measurement.forza_n);
          const spostamentoData = data.map((measurement) => measurement.spostamento_mm);
          const pressioneData = data.map((measurement) => measurement.pressione_bar);
          const contropressioneData = data.map((measurement) => measurement.contropressione_bar);

          setChartData({
            labels,
            datasets: [
              { data: forzaData, label: 'Forza (N)', borderColor: 'rgba(75,192,192,1)', borderWidth: 2, fill: false },
              { data: spostamentoData, label: 'Spostamento (mm)', borderColor: 'rgba(192,75,75,1)', borderWidth: 2, fill: false },
              { data: pressioneData, label: 'Pressione (bar)', borderColor: 'rgba(75,75,192,1)', borderWidth: 2, fill: false },
              { data: contropressioneData, label: 'Contropressione (bar)', borderColor: 'rgba(75,192,75,1)', borderWidth: 2, fill: false },
            ]
          });
        } catch (error) {
          console.error('Error fetching latest measurement:', error);
        }
      };

      fetchLatestMeasurement();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Ultima Misurazione</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Dettagli della misurazione
        </Typography>
        <Line data={chartData} />
      </DialogContent>
    </Dialog>
  );
};

export default LatestMeasurementModal;
