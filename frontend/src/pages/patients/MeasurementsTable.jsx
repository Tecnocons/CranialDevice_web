import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MeasurementsTable = ({ open, onClose, patientId }) => {
  const [measurements, setMeasurements] = useState([]);
  const [filteredMeasurements, setFilteredMeasurements] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [groupedMeasurements, setGroupedMeasurements] = useState({});
  const [selectedMeasurementGroup, setSelectedMeasurementGroup] = useState(null);

  useEffect(() => {
    if (open) {
      fetchMeasurements();
    }
  }, [open]);

  const fetchMeasurements = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/measurements/${patientId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMeasurements(data);
      filterMeasurementsByTimeframe(data, selectedTimeframe);
    } catch (error) {
      console.error('Error fetching measurements:', error);
    }
  };

  const filterMeasurementsByTimeframe = (data, timeframe) => {
    const now = new Date();
    let filtered = [];

    switch (timeframe) {
      case 'today':
        filtered = data.filter(measurement => new Date(measurement.timestamp).toDateString() === now.toDateString());
        break;
      case 'thisWeek':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        filtered = data.filter(measurement => new Date(measurement.timestamp) >= startOfWeek);
        break;
      case 'thisMonth':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = data.filter(measurement => new Date(measurement.timestamp) >= startOfMonth);
        break;
      case 'thisYear':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        filtered = data.filter(measurement => new Date(measurement.timestamp) >= startOfYear);
        break;
      default:
        filtered = data;
    }
    setFilteredMeasurements(filtered);
    groupMeasurements(filtered);
  };

  const groupMeasurements = (data) => {
    const grouped = data.reduce((acc, curr) => {
      if (!acc[curr.measurement_id]) {
        acc[curr.measurement_id] = [];
      }
      acc[curr.measurement_id].push(curr);
      return acc;
    }, {});
    setGroupedMeasurements(grouped);
  };

  const handleTimeframeChange = (event) => {
    setSelectedTimeframe(event.target.value);
    filterMeasurementsByTimeframe(measurements, event.target.value);
  };

  const handleMeasurementClick = (measurementId) => {
    setSelectedMeasurementGroup(groupedMeasurements[measurementId]);
  };

  const handleBackToGroups = () => {
    setSelectedMeasurementGroup(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Dettagli Misurazioni
        <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {selectedMeasurementGroup ? (
          <>
            <Button onClick={handleBackToGroups} style={{ marginBottom: '16px' }}>
              INDIETRO
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Spostamento (mm)</TableCell>
                    <TableCell>Forza (N)</TableCell>
                    <TableCell>Pressione (bar)</TableCell>
                    <TableCell>Contropressione (bar)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedMeasurementGroup.map((measurement, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(measurement.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{measurement.spostamento_mm}</TableCell>
                      <TableCell>{measurement.forza_n}</TableCell>
                      <TableCell>{measurement.pressione_bar}</TableCell>
                      <TableCell>{measurement.contropressione_bar}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <>
            <Typography variant="h6">Misurazioni</Typography>
            <Select
              value={selectedTimeframe}
              onChange={handleTimeframeChange}
              style={{ marginBottom: '16px' }}
            >
              <MenuItem value="today">Oggi</MenuItem>
              <MenuItem value="thisWeek">Questa settimana</MenuItem>
              <MenuItem value="thisMonth">Questo mese</MenuItem>
              <MenuItem value="thisYear">Quest'anno</MenuItem>
            </Select>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Measurement ID</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(groupedMeasurements).map(measurementId => (
                    <TableRow key={measurementId} onClick={() => handleMeasurementClick(measurementId)} style={{ cursor: 'pointer' }}>
                      <TableCell>{measurementId}</TableCell>
                      <TableCell>{new Date(groupedMeasurements[measurementId][0].timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementsTable;
