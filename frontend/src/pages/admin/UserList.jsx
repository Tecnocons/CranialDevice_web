import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f5f5f5',
});

const StyledTable = styled(Table)({
  minWidth: 650,
});

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: 16,
});

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Data is not an array');
        }
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <Root><Typography>Loading...</Typography></Root>;
  }

  if (error) {
    return <Root><Typography>Error: {error}</Typography></Root>;
  }

  return (
    <Root>
      <Container component={Paper} style={{ padding: 16 }}>
        <Header>
          <Button variant="contained" color="primary" onClick={() => navigate('/main')}>
            Indietro
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            User List
          </Typography>
        </Header>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uuid}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.isadmin ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Container>
    </Root>
  );
}

export default UserList;
