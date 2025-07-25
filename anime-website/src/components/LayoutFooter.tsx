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
          <a href="#" className="hover:text-red-600 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-red-600 transition-colors">Términos</a>
          <a href="#" className="hover:text-red-600 transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default LayoutFooter;
