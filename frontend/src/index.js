import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f5f5;
  }

  .root {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-grow: 1;
    padding: 10px;
  }

  .table-container {
    width: 80%;
    max-width: 1150px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: 0 auto;
  }

  .table-header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .styled-table {
    width: 100%;
    margin: 5px 0;
    border-collapse: collapse;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
  }

  .styled-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
    font-weight: bold;
  }

  .styled-table th,
  .styled-table td {
    padding: 6px 10px;
    font-size: 0.875rem;
  }

  .styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  .styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }

  .styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  .add-patient-btn, .add-user-btn {
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    border: 0;
    background-color: white;
    box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-size: 12px;
    transition: all 0.5s ease;
    display: flex;
    align-items: center;
  }

  .add-patient-btn:hover, .add-user-btn:hover {
    letter-spacing: 3px;
    background-color: hsl(261deg 80% 48%);
    color: hsl(0, 0%, 100%);
    box-shadow: rgb(93 24 220) 0px 7px 29px 0px;
  }

  .add-patient-btn:active, .add-user-btn:active {
    letter-spacing: 3px;
    background-color: hsl(261deg 80% 48%);
    color: hsl(0, 0%, 100%);
    box-shadow: rgb(93 24 220) 0px 0px 0px 0px;
    transform: translateY(10px);
    transition: 100ms;
  }

  .add-patient-btn-icon, .add-user-btn-icon {
    margin-right: 8px;
  }

  .pagination {
    margin-top: auto;
  }
`;

ReactDOM.render(
  <AuthProvider>
    <ThemeProvider theme={{}}>
      <GlobalStyle />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </AuthProvider>,
  document.getElementById('root')
);
