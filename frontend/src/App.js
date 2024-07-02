import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './pages/login/LoginRegister';
import MainPage from './pages/main/MainPage';
import AddUser from './pages/admin/AddUser';
import UserList from './pages/admin/UserList';
import PatientList from './pages/patients/PatientList';
import PatientProfile from './pages/patients/PatientProfile';
import PathologyList from './pages/pathologies/PathologyList';
import SymptomList from './pages/symptoms/SymptomList';
import HamburgerMenu from './components/HamburgerMenu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from './contexts/AuthContext';
import { Outlet } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#EB873F',
    },
    secondary: {
      main: '#CF6F2E',
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

function App() {
  const { user } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route element={<AppLayout />}>
          <Route path="/main" element={<MainPage />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:uuid" element={<PatientProfile />} />
          <Route path="/pathologies" element={<PathologyList />} />
          <Route path="/symptoms" element={<SymptomList />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
