import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardHeader, Button } from '@mui/material';
import HamburgerMenu from '../../components/HamburgerMenu';
import { useAuth } from '../../contexts/AuthContext';
import { Bar } from 'react-chartjs-2';

const MainPage = () => {
  const { user } = useAuth();

  // Dati fittizi per il grafico
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

  return (
    <>
      <HamburgerMenu />
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
                <Button variant="contained" color="primary" style={{ marginTop: 16 }}>
                  View Details
                </Button>
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
                <Button variant="contained" color="primary" style={{ marginTop: 16 }}>
                  View Details
                </Button>
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
                <Button variant="contained" color="primary" style={{ marginTop: 16 }}>
                  View Details
                </Button>
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
                <Button variant="contained" color="primary" style={{ marginTop: 16 }}>
                  View Details
                </Button>
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
                <Button variant="contained" color="primary" style={{ marginTop: 16 }}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default MainPage;
