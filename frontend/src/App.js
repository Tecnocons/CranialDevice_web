import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginRegister from './pages/login/LoginRegister';
import MainPage from './pages/main/MainPage';
import AddUser from './pages/admin/AddUser';
import UserList from './pages/admin/UserList';
import PatientList from './pages/patients/PatientList';
import PatientProfile from './pages/patients/PatientProfile';
import PathologyList from './pages/pathologies/PathologyList';
import SymptomList from './pages/symptoms/SymptomList';
import HamburgerMenu from './components/HamburgerMenu';
import TraumaticEvent from './pages/traumatic_events/TraumaticEventList';
import SurgeryList from './pages/surgery/SurgeryList';
import TreatmentList from './pages/treatments/TreatmentList';
import LatestMeasurement from './pages/main/LatestMeasurementModal';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth, AuthProvider, LoadingProvider, useLoading } from './contexts/AuthContext';
import { Outlet } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

const theme = createTheme({
  palette: {
    primary: {
      main: '#EB873F',
    },
    secondary: {
      main: '#CF6F2E',
    },
    success: {
      main: '#155677',
    },
  },
});

function AppLayout() {
  return (
    <>
      <HamburgerMenu />
      <Outlet />
    </>
  );
}

const RouteWrapper = ({ element }) => {
  const { showLoading, hideLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    showLoading();
    const handlePageLoad = () => {
      hideLoading();
    };

    if (document.readyState === 'complete') {
      hideLoading();
    } else {
      window.addEventListener('load', handlePageLoad);
    }

    return () => {
      window.removeEventListener('load', handlePageLoad);
    };
  }, [location.pathname, showLoading, hideLoading]);

  return element;
};

function LoadingIndicator() {
  const { isLoading } = useLoading();
  return isLoading ? (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999, // Assicurati che sia sopra tutto il resto
      }}
    >
      <ClipLoader size={50} color={'#123abc'} loading={isLoading} />
    </div>
  ) : null;
}

function App() {
  const { user } = useAuth();

  return (
    <LoadingProvider>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/login" element={<LoginRegister />} />
          <Route element={<AppLayout />}>
            <Route path="/main" element={<RouteWrapper element={<MainPage />} />} />
            <Route path="/add-user" element={<RouteWrapper element={<AddUser />} />} />
            <Route path="/users" element={<RouteWrapper element={<UserList />} />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/patients" element={<RouteWrapper element={<PatientList />} />} />
            <Route path="/patients/:uuid" element={<RouteWrapper element={<PatientProfile />} />} />
            <Route path="/pathologies" element={<RouteWrapper element={<PathologyList />} />} />
            <Route path="/symptoms" element={<RouteWrapper element={<SymptomList />} />} />
            <Route path="/traumatic-events" element={<RouteWrapper element={<TraumaticEvent />} />} />
            <Route path="/surgeries" element={<RouteWrapper element={<SurgeryList />} />} />
            <Route path="/treatments" element={<RouteWrapper element={<TreatmentList />} />} />
            <Route path="/latest-measurement" element={<RouteWrapper element={<LatestMeasurement />} />} />
          </Route>
        </Routes>
        <LoadingIndicator />
      </ThemeProvider>
    </LoadingProvider>
  );
}

function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default RootApp;
