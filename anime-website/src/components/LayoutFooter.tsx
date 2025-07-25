import React from 'react';

interface LayoutFooterProps {
  copyrightText?: string;
}

const LayoutFooter: React.FC<LayoutFooterProps> = ({ copyrightText = 'CineSangre © 2023. Todos los derechos reservados.' }) => {
  return (
    <footer className="bg-black text-gray-400 py-6 border-t border-red-800 shadow-inner">
      <div className="container mx-auto text-center text-sm">
        <p>{copyrightText}</p>
        <div className="flex justify-center space-x-4 mt-2">
          <button className="bg-transparent border-none text-gray-400 hover:text-red-600 transition-colors">Privacidad</button>
          <button className="bg-transparent border-none text-gray-400 hover:text-red-600 transition-colors">Términos</button>
          <button className="bg-transparent border-none text-gray-400 hover:text-red-600 transition-colors">Contacto</button>
        </div>
      </div>
    </footer>
  );
};

export default LayoutFooter;
