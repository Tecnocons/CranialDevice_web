import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './MeasurementsTable.css';

const MeasurementsTable = ({ open, onClose, patientId }) => {
  const [measurements, setMeasurements] = useState([]);
  const [filteredMeasurements, setFilteredMeasurements] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [groupedMeasurements, setGroupedMeasurements] = useState({});
  const [selectedMeasurementGroup, setSelectedMeasurementGroup] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const uniqueMeasurements = Object.values(groupedMeasurements).map(group => group[0]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Dettagli Misurazioni
        <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="measurements-dialog">
        {selectedMeasurementGroup ? (
          <>
            <div className="measurements-back-button" onClick={handleBackToGroups}>
              <ArrowBackIcon className="measurements-back-icon" />
              <Typography variant="button">INDIETRO</Typography>
            </div>
            <div className="measurements-table-wrapper">
              <TableContainer component={Paper}>
                <Table className="measurements-table">
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
            </div>
          </>
        ) : (
          <>
            <div className="measurements-table-container">
              <TableContainer component={Paper}>
                <Table className="measurements-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Measurement ID</TableCell>
                      <TableCell>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uniqueMeasurements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((measurement, index) => (
                      <TableRow key={index} onClick={() => handleMeasurementClick(measurement.measurement_id)} style={{ cursor: 'pointer' }}>
                        <TableCell>{measurement.measurement_id}</TableCell>
                        <TableCell>{new Date(measurement.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={uniqueMeasurements.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
            <div className="measurements-filter-container">
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
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementsTable;
