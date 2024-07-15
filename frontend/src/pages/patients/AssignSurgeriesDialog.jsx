import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
  Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AssignSurgeriesDialog = ({ open, onClose, patient, onAssign }) => {
  const [allSurgeries, setAllSurgeries] = useState([]);
  const [selectedSurgeries, setSelectedSurgeries] = useState([]);
  const [assignedSurgeries, setAssignedSurgeries] = useState([]);

  useEffect(() => {
    if (patient && open) {
      const fetchAllSurgeries = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/surgeries', {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setAllSurgeries(data);
        } catch (error) {
          console.error('Error fetching surgeries:', error);
        }
      };

      const fetchAssignedSurgeries = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/patient_surgery/${patient.uuid}`, {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setAssignedSurgeries(data);
          setSelectedSurgeries(data.map(s => s.id));
        } catch (error) {
          console.error('Error fetching assigned surgeries:', error);
        }
      };

      fetchAllSurgeries();
      fetchAssignedSurgeries();
    }
  }, [open, patient]);

  const handleAutocompleteChange = (event, newValue) => {
    const newSelectedSurgeries = newValue.map(s => s.id).filter((id) => {
      return !assignedSurgeries.some(s => s.id === id);
    });
    setSelectedSurgeries(newSelectedSurgeries);
  };

  const handleRemove = async (surgeryId) => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_surgery', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, surgery_id: surgeryId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setAssignedSurgeries(prev => prev.filter(s => s.id !== surgeryId));
      setSelectedSurgeries(prev => prev.filter(id => id !== surgeryId));
    } catch (error) {
      console.error('Error removing surgery:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_surgery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, surgery_ids: selectedSurgeries }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning surgeries:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assegna Interventi a {patient && patient.nominativo}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Seleziona uno o più interventi da assegnare a questo paziente.
        </DialogContentText>
        <Autocomplete
          multiple
          options={allSurgeries}
          getOptionLabel={(option) => option.name}
          value={allSurgeries.filter(s => selectedSurgeries.includes(s.id) || assignedSurgeries.some(as => as.id === s.id))}
          onChange={handleAutocompleteChange}
          renderInput={(params) => <TextField {...params} label="Interventi" placeholder="Seleziona interventi" />}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                disabled={assignedSurgeries.some(s => s.id === option.id)}
              />
              {option.name}
            </li>
          )}
        />
        <Typography variant="h6" style={{ marginTop: '16px' }}>Interventi Assegnati</Typography>
        {assignedSurgeries.map((surgery) => (
          <div key={surgery.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>{surgery.name}</Typography>
            <IconButton onClick={() => handleRemove(surgery.id)} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annulla
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Conferma
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignSurgeriesDialog;
