import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../contexts/AuthContext';
import AddPathologyDialog from './AddPathologyDialog';
import EditPathologyDialog from './EditPathologyDialog';
import { ClipLoader } from 'react-spinners';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import './PathologyList.css';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f5f5f5',
  opacity: 0.9,
  padding: '20px',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  opacity: 0.9,
  width: '100%',
  backgroundColor: '#ffffff',
  boxShadow: '0 0 10px rgba(21, 86, 119, 0.5)',
  '& .MuiTableCell-head': {
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
    fontSize: 22,
  },
  '& .MuiTableCell-body': {
    fontSize: 17,
  },
  '& .MuiTableRow-root .MuiTableCell-root': {
    borderBottom: '1px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
    fontFamily: 'Arial, sans-serif',
  },
  '& .MuiTableRow-root:last-child .MuiTableCell-root': {
    borderBottom: '2px solid #155677',
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiTableCell-head': {
      fontSize: 16,
    },
    '& .MuiTableCell-body': {
      fontSize: 12,
    },
  },
}));

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: 10,
});

const AddButton = styled(Button)({
  backgroundColor: '#155677',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#0d3e4f',
  },
});

const PathologyListContainer = styled(Container)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(21, 86, 119, 0.5)',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  width: '90%',
  height: 'auto',
  backgroundColor: '#155677',
  color: '#fff',
  padding: '10px',
  borderRadius: '8px',
  textAlign: 'center',
  marginBottom: '10px',
  marginTop: '-13px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: '5px',
    fontSize: '1rem',
  },
}));

function PathologyList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pathologies, setPathologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPathology, setSelectedPathology] = useState(null);
  const [selectedPathologies, setSelectedPathologies] = useState([]);

  useEffect(() => {
    const fetchPathologies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pathologies', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPathologies(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPathologies();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (ids) => {
    try {
      const response = await fetch('http://localhost:5000/api/pathologies/bulk_delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setPathologies((prevPathologies) => prevPathologies.filter((pathology) => !ids.includes(pathology.id)));
      setDeleteDialogOpen(false);
      setSelectedPathologies([]);
      setSelectedPathology(null);
    } catch (error) {
      console.error('Error deleting pathology:', error.message);
    }
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handlePathologyAdded = () => {
    setAddDialogOpen(false);
    const fetchPathologies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pathologies', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPathologies(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPathologies();
  };

  const handleEditDialogOpen = (pathology) => {
    setSelectedPathology(pathology);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedPathology(null);
  };

  const handleEditSubmit = async (updatedPathology) => {
    try {
      const response = await fetch('http://localhost:5000/api/pathologies', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedPathology),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setPathologies((prevPathologies) =>
        prevPathologies.map((pathology) =>
          pathology.id === updatedPathology.id ? { ...pathology, ...updatedPathology } : pathology
        )
      );
      setEditDialogOpen(false);
      setSelectedPathology(null);
    } catch (error) {
      console.error('Error updating pathology:', error.message);
    }
  };

  const handleDeleteDialogOpen = (pathology) => {
    setSelectedPathology(pathology);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedPathology(null);
  };

  const handleSelectPathology = (id) => {
    if (selectedPathologies.includes(id)) {
      setSelectedPathologies(selectedPathologies.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedPathologies([...selectedPathologies, id]);
    }
  };

  const isSelected = (id) => selectedPathologies.includes(id);

  const handleSelectAllPathologies = (event) => {
    if (event.target.checked) {
      const newSelecteds = pathologies.map((pathology) => pathology.id);
      setSelectedPathologies(newSelecteds);
    } else {
      setSelectedPathologies([]);
    }
  };

  const isAllSelected = selectedPathologies.length === pathologies.length;

  const handleMultipleDelete = () => {
    setDeleteDialogOpen(true);
    setSelectedPathology(null);
  };

  if (loading) {
    return (
      <Root>
        <Box display="flex" flexDirection="column" alignItems="center">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
          <Typography variant="h6" style={{ marginTop: '20px' }}>Loading...</Typography>
        </Box>
      </Root>
    );
  }

  if (error) {
    return (
      <Root>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" color="error">Error: {error}</Typography>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>Retry</Button>
        </Box>
      </Root>
    );
  }

  return (
    <BackgroundWrapper>
      <Root>
        <HeaderContainer>
          <Typography variant="h4" component="h1" gutterBottom>
            Lista Patologie
          </Typography>
        </HeaderContainer>
        <PathologyListContainer component={Paper} className="table-container">
          <Header>
            <IconButton onClick={() => navigate('/main')}>
              <CloseIcon />
            </IconButton>
            {user && user.isAdmin && (
              <AddButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddDialogOpen}
              >
                Aggiungi Patologia
              </AddButton>
            )}
          </Header>
          <StyledTable className="styled-table">
            <TableHead>
              <TableRow>
                {user && user.isAdmin && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedPathologies.length > 0 && selectedPathologies.length < pathologies.length}
                      checked={isAllSelected}
                      onChange={handleSelectAllPathologies}
                    />
                  </TableCell>
                )}
                <TableCell className="table-header">Nome</TableCell>
                <TableCell className="table-header">Descrizione</TableCell>
                {user && user.isAdmin && <TableCell className="table-header">Azioni</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {pathologies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pathology) => (
                <TableRow
                  key={pathology.id}
                  hover
                  role="checkbox"
                  aria-checked={isSelected(pathology.id)}
                  selected={isSelected(pathology.id)}
                >
                  {user && user.isAdmin && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(pathology.id)}
                        onChange={() => handleSelectPathology(pathology.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{pathology.name}</TableCell>
                  <TableCell>{pathology.description}</TableCell>
                  {user && user.isAdmin && (
                    <TableCell>
                      <IconButton onClick={() => handleEditDialogOpen(pathology)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteDialogOpen(pathology)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={pathologies.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="pagination"
          />
        </PathologyListContainer>
        {user && user.isAdmin && (
          <AddPathologyDialog open={addDialogOpen} onClose={handleAddDialogClose} onPathologyAdded={handlePathologyAdded} />
        )}
        {user && user.isAdmin && selectedPathology && (
          <EditPathologyDialog
            open={editDialogOpen}
            onClose={handleEditDialogClose}
            onEditSubmit={handleEditSubmit}
            pathology={selectedPathology}
          />
        )}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Conferma Eliminazione</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedPathology
                ? `Sei sicuro di voler eliminare la patologia ${selectedPathology.name}?`
                : 'Sei sicuro di voler eliminare le patologie selezionate?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Annulla
            </Button>
            <Button
              onClick={() => handleDelete(selectedPathology ? [selectedPathology.id] : selectedPathologies)}
              color="primary"
              autoFocus
            >
              Elimina
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </BackgroundWrapper>
  );
}

export default PathologyList;
