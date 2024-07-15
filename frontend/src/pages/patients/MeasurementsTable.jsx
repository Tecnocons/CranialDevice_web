import React from 'react';
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

const MeasurementsTable = ({ open, onClose, measurements }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Misurazioni</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Contropressione (bar)</TableCell>
              <TableCell>Forza (N)</TableCell>
              <TableCell>Pressione (bar)</TableCell>
              <TableCell>Spostamento (mm)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {measurements.map((measurement, index) => (
              <TableRow key={index}>
                <TableCell>{measurement.timestamp}</TableCell>
                <TableCell>{measurement.contropressione_bar}</TableCell>
                <TableCell>{measurement.forza_n}</TableCell>
                <TableCell>{measurement.pessione_bar}</TableCell>
                <TableCell>{measurement.spostamento_mm}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={onClose} color="primary">
          Chiudi
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementsTable;
