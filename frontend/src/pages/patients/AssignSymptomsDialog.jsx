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

const AssignSymptomsDialog = ({ open, onClose, patient, onAssign }) => {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [assignedSymptoms, setAssignedSymptoms] = useState([]);

  useEffect(() => {
    const fetchAllSymptoms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/symptoms', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllSymptoms(data);
      } catch (error) {
        console.error('Error fetching symptoms:', error);
      }
    };

    const fetchAssignedSymptoms = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patient_symptom/${patient.uuid}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAssignedSymptoms(data);
        setSelectedSymptoms(data.map(s => s.id));
      } catch (error) {
        console.error('Error fetching assigned symptoms:', error);
      }
    };

    if (open) {
      fetchAllSymptoms();
      fetchAssignedSymptoms();
    }
  }, [open, patient.uuid]);

  const handleAutocompleteChange = (event, newValue) => {
    const newSelectedSymptoms = newValue.map(s => s.id).filter((id) => {
      return !assignedSymptoms.some(s => s.id === id);
    });
    setSelectedSymptoms(newSelectedSymptoms);
  };

  const handleRemove = async (symptomId) => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_symptom', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, symptom_id: symptomId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setAssignedSymptoms(prev => prev.filter(s => s.id !== symptomId));
      setSelectedSymptoms(prev => prev.filter(id => id !== symptomId));
    } catch (error) {
      console.error('Error removing symptom:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_symptom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, symptom_ids: selectedSymptoms }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning symptoms:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assegna Sintomi a {patient.nominativo}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Seleziona uno o più sintomi da assegnare a questo paziente.
        </DialogContentText>
        <Autocomplete
          multiple
          options={allSymptoms}
          getOptionLabel={(option) => option.name}
          value={allSymptoms.filter(s => selectedSymptoms.includes(s.id) || assignedSymptoms.some(as => as.id === s.id))}
          onChange={handleAutocompleteChange}
          renderInput={(params) => <TextField {...params} label="Sintomi" placeholder="Seleziona sintomi" />}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                disabled={assignedSymptoms.some(s => s.id === option.id)}
              />
              {option.name}
            </li>
          )}
        />
        <Typography variant="h6" style={{ marginTop: '16px' }}>Sintomi Assegnati</Typography>
        {assignedSymptoms.map((symptom) => (
          <div key={symptom.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>{symptom.name}</Typography>
            <IconButton onClick={() => handleRemove(symptom.id)} size="small">
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

export default AssignSymptomsDialog;
