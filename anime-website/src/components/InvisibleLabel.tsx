import React from 'react';

interface InvisibleLabelProps {
  text?: string;
}

const InvisibleLabel: React.FC<InvisibleLabelProps> = ({ text = "Espacio Reducido" }) => {
  return (
    <div className="sr-only">
      {text}
    </div>
  );
};

export default InvisibleLabel;
