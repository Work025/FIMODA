import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Style/Button.css';

export default function Button({ children, to = '/dokon', className = '', ...props }) {
  const navigate = useNavigate();
  return (
    <button 
      className={`btn-primary ${className}`} 
      onClick={() => navigate(to)}
      {...props}
    >
      {children}
    </button>
  );
}
