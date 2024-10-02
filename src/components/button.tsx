import React,{useState} from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset"; // Add the type prop for button types
}

const Button = ({ children, onClick, type = "button" }: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const ButtonStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "12px",
    backgroundColor: isHovered ? '#1D4ED8' : '#2563EB',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 600,
    textAlign: 'center',
    borderRadius:'6Px',
    transition: 'background-color 0.3s ease',
  };

  return (
    <button 
      type={type} 
      style={ButtonStyle}
      onClick={onClick}
      onMouseEnter={()=>setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Button;
