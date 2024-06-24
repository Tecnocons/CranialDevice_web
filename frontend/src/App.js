import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './pages/login/LoginRegister';
import MainPage from './pages/main/MainPage';
import AddUser from './pages/admin/AddUser';
import UserList from './pages/admin/UserList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/" element={<LoginRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
