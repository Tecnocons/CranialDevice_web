import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardHeader, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { Bar } from 'react-chartjs-2';
import { styled } from '@mui/system';
import './MainPage.css';

const primaryColor = '#EB873F';  
const darkPrimaryColor = '#CF6F2E';  

const StyledButton = styled(Button)({
  backgroundColor: primaryColor,
  '&:hover': {
    backgroundColor: darkPrimaryColor,
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
    <div className="mainpage-container">
      <Container>
        <div className="header">
          <Typography variant="h4" component="h1" className="header-title">
            Main Page
          </Typography>
          <Typography className="header-subtitle">
            {user.isAdmin ? 'Welcome, Admin! You have full access.' : 'Welcome, User! Your access is limited.'}
          </Typography>
        </div>
        <Grid container spacing={3} className="grid">
          <Grid item xs={12} sm={6} md={4} className="grid-item">
            <Card className="card">
              <CardHeader title="Recent Treatments" className="card-title" />
              <CardContent>
                <Typography variant="body2" className="card-text">
                  List of recent patients treated...
                </Typography>
                <StyledButton variant="contained" className="btn">
                  View Details
                </StyledButton>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} className="grid-item">
            <Card className="card">
              <CardHeader title="Treatment List" className="card-title" />
              <CardContent>
                <Typography variant="body2" className="card-text">
                  List of available treatments...
                </Typography>
                <StyledButton variant="contained" className="btn">
                  View Details
                </StyledButton>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={12} md={8} className="grid-item">
            <Card className="card">
              <CardHeader title="Treatment Chart" className="card-title" />
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

          <Grid item xs={12} sm={6} md={4} className="grid-item">
            <Card className="card">
              <CardHeader title="Placeholder 1" className="card-title" />
              <CardContent>
                <Typography variant="body2" className="card-text">
                  Some placeholder content...
                </Typography>
                <StyledButton variant="contained" className="btn">
                  View Details
                </StyledButton>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} className="grid-item">
            <Card className="card">
              <CardHeader title="Placeholder 2" className="card-title" />
              <CardContent>
                <Typography variant="body2" className="card-text">
                  Some placeholder content...
                </Typography>
                <StyledButton variant="contained" className="btn">
                  View Details
                </StyledButton>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} className="grid-item">
            <Card className="card">
              <CardHeader title="Placeholder 3" className="card-title" />
              <CardContent>
                <Typography variant="body2" className="card-text">
                  Some placeholder content...
                </Typography>
                <StyledButton variant="contained" className="btn">
                  View Details
                </StyledButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default MainPage;
