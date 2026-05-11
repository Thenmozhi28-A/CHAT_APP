import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => {
  return (
    <label 
      className={`text-sm font-medium text-gray-300 ml-1 ${className}`} 
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
