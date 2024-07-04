import React from 'react';
import { useLocation } from 'react-router-dom';
import './BackgroundWrapper.css';

const BackgroundWrapper = ({ children }) => {
  const location = useLocation();
  const excludePaths = ['/login', '/main'];

  if (excludePaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  return <div className="background-wrapper">{children}</div>;
};

export default BackgroundWrapper;
