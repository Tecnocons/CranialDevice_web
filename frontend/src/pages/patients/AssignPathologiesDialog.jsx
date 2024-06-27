import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';

const AssignPathologiesDialog = ({ open, onClose, patient, onAssign }) => {
  const [pathologies, setPathologies] = useState([]);
  const [selectedPathologies, setSelectedPathologies] = useState([]);

  useEffect(() => {
    const fetchPathologies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pathologies', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setPathologies(data);
      } catch (error) {
        console.error('Error fetching pathologies:', error);
      }
    };

    fetchPathologies();
  }, []);

  const handleAssign = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_pathology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, pathology_ids: selectedPathologies }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning pathologies:', error);
    }
  };

  const handleChange = (event) => {
    setSelectedPathologies(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assign Pathologies to {patient.nominativo}</DialogTitle>
      <DialogContent>
        <Typography>Select one or more pathologies to assign to this patient.</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Pathologies</InputLabel>
          <Select
            multiple
            value={selectedPathologies}
            onChange={handleChange}
            renderValue={(selected) => selected.map(id => {
              const pathology = pathologies.find(p => p.id === id);
              return pathology ? pathology.name : '';
            }).join(', ')}
          >
            {pathologies.map((pathology) => (
              <MenuItem key={pathology.id} value={pathology.id}>
                <Checkbox checked={selectedPathologies.indexOf(pathology.id) > -1} />
                <ListItemText primary={pathology.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleAssign} color="primary">Assign</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignPathologiesDialog;
