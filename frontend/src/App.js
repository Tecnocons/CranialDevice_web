import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
