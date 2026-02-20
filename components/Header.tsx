import React from 'react';
import { Handshake, Menu } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, isLoggedIn, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-darkBg/80 border-b border-neon/15">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon to-neonDark shadow-[0_0_24px_rgba(124,255,79,0.35)] flex items-center justify-center text-darkBg">
            <Handshake size={24} strokeWidth={2.5} />
          </div>
          <strong className="text-xl tracking-tight font-bold text-white">MultiCota</strong>
        </div>
        
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <button 
              onClick={onLoginClick} 
              className="px-5 py-2 rounded-xl bg-neon text-darkBg font-bold hover:bg-neon/90 transition-all shadow-[0_0_10px_rgba(124,255,79,0.1)] text-sm md:text-base"
            >
              Entrar
            </button>
          ) : (
            <nav className="hidden md:flex items-center">
              <button 
                onClick={onLogout} 
                className="px-5 py-2 rounded-xl border border-red-500/40 text-red-400 font-bold hover:bg-red-500/10 transition-all text-sm md:text-base"
              >
                Sair
              </button>
            </nav>
          )}
          
          <div className="md:hidden text-gray-300">
            <Menu size={24} />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;