import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardHeader, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { Bar } from 'react-chartjs-2';
import { styled } from '@mui/system';

const orangeColor = '#EB873F';  // Colore arancione estratto dall'immagine di sfondo
const darkOrangeColor = '#CF6F2E';  // Colore arancione più scuro per l'effetto hover del pulsante

const StyledButton = styled(Button)({
  backgroundColor: orangeColor,
  '&:hover': {
    backgroundColor: darkOrangeColor,
  },
});

const MainPage = () => {
  const { user } = useAuth();

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Treatments',
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.8)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: [65, 59, 80, 81, 56, 55]
      }
    ]
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Main Page
      </Typography>
      <Typography>
        {user.isAdmin ? 'Welcome, Admin! You have full access.' : 'Welcome, User! Your access is limited.'}
      </Typography>

      <Grid container spacing={3} style={{ marginTop: 16 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Recent Treatments" />
            <CardContent>
              <Typography variant="body2">
                List of recent patients treated...
              </Typography>
              <StyledButton variant="contained" style={{ marginTop: 16 }}>
                View Details
              </StyledButton>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Treatment List" />
            <CardContent>
              <Typography variant="body2">
                List of available treatments...
              </Typography>
              <StyledButton variant="contained" style={{ marginTop: 16 }}>
                View Details
              </StyledButton>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Treatment Chart" />
            <CardContent>
              <Bar
                data={data}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true
                        }
                      }
                    ]
                  }
                }}
                height={200}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Placeholder 1" />
            <CardContent>
              <Typography variant="body2">
                Some placeholder content...
              </Typography>
              <StyledButton variant="contained" style={{ marginTop: 16 }}>
                View Details
              </StyledButton>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Placeholder 2" />
            <CardContent>
              <Typography variant="body2">
                Some placeholder content...
              </Typography>
              <StyledButton variant="contained" style={{ marginTop: 16 }}>
                View Details
              </StyledButton>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Placeholder 3" />
            <CardContent>
              <Typography variant="body2">
                Some placeholder content...
              </Typography>
              <StyledButton variant="contained" style={{ marginTop: 16 }}>
                View Details
              </StyledButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainPage;
