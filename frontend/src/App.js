import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<h1>Hello, World!</h1>} />
      </Routes>
    </div>
  );
}

export default App;
