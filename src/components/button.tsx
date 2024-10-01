import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void; // Optional onClick handler
}

const Button = ({ children, onClick }: ButtonProps) => {
  const ButtonStyle = {
    display: "inline-block",
    padding: "10px",
    backgroundColor: '#000',
    color: '#fff',
    marginBottom: '10px',
    cursor: 'pointer',
  };

  return (
    <div style={ButtonStyle} onClick={onClick}>
      {children}
    </div>
  );
};

export default Button;
