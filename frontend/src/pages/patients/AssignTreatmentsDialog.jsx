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
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AssignTreatmentsDialog = ({ open, onClose, patient, onAssign }) => {
  const [allTreatments, setAllTreatments] = useState([]);
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [assignedTreatments, setAssignedTreatments] = useState([]);

  useEffect(() => {
    const fetchAllTreatments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/treatments', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllTreatments(data);
      } catch (error) {
        console.error('Error fetching treatments:', error);
      }
    };

    const fetchAssignedTreatments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patient_treatment/${patient.uuid}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAssignedTreatments(data);
        setSelectedTreatments(data.map(t => t.id));
      } catch (error) {
        console.error('Error fetching assigned treatments:', error);
      }
    };

    if (open) {
      fetchAllTreatments();
      fetchAssignedTreatments();
    }
  }, [open, patient.uuid]);

  const handleAutocompleteChange = (event, newValue) => {
    const newSelectedTreatments = newValue.map(t => t.id).filter((id) => {
      return !assignedTreatments.some(t => t.id === id);
    });
    setSelectedTreatments(newSelectedTreatments);
  };

  const handleRemove = async (treatmentId) => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_treatment', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, treatment_id: treatmentId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setAssignedTreatments(prev => prev.filter(t => t.id !== treatmentId));
      setSelectedTreatments(prev => prev.filter(id => id !== treatmentId));
    } catch (error) {
      console.error('Error removing treatment:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_treatment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, treatment_ids: selectedTreatments }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning treatments:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assegna Trattamenti a {patient.nominativo}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Seleziona uno o più trattamenti da assegnare a questo paziente.
        </DialogContentText>
        <Autocomplete
          multiple
          options={allTreatments}
          getOptionLabel={(option) => option.name}
          value={allTreatments.filter(t => selectedTreatments.includes(t.id) || assignedTreatments.some(at => at.id === t.id))}
          onChange={handleAutocompleteChange}
          renderInput={(params) => <TextField {...params} label="Trattamenti" placeholder="Seleziona trattamenti" />}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                disabled={assignedTreatments.some(t => t.id === option.id)}
              />
              {option.name}
            </li>
          )}
        />
        <Typography variant="h6" style={{ marginTop: '16px' }}>Trattamenti Assegnati</Typography>
        {assignedTreatments.map((treatment) => (
          <div key={treatment.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>{treatment.name}</Typography>
            <IconButton onClick={() => handleRemove(treatment.id)} size="small">
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

export default AssignTreatmentsDialog;
