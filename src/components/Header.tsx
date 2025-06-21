import React, { useState } from 'react';
import { Menu, X, Dumbbell, UserCircle, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              FitVoice
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" label="Dashboard" isActive={isActive('/')} />
            <NavLink to="/workouts" label="Workouts" isActive={isActive('/workouts')} />
            <NavLink to="/nutrition" label="Nutrition" isActive={isActive('/nutrition')} />
            <NavLink to="/progress" label="Progress" isActive={isActive('/progress')} />
          </nav>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-secondary-500"></span>
            </button>
            <button className="flex items-center space-x-2 py-2 px-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <UserCircle size={20} className="text-gray-700" />
              <span className="text-sm text-gray-700 font-medium">Profile</span>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 pt-6 border-t border-gray-200 mt-4">
            <nav className="flex flex-col space-y-6">
              <MobileNavLink to="/" label="Dashboard" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink to="/workouts" label="Workouts" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink to="/nutrition" label="Nutrition" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink to="/progress" label="Progress" onClick={() => setIsMenuOpen(false)} />
              <hr className="border-gray-200" />
              <MobileNavLink to="/profile" label="Profile" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink to="/notifications" label="Notifications" onClick={() => setIsMenuOpen(false)} />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`relative py-2 text-base font-medium hover:text-primary-600 transition-colors duration-200 ${
        isActive ? 'text-primary-600' : 'text-gray-700'
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary-500 rounded"></span>
      )}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  label: string;
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, onClick }) => {
  return (
    <Link 
      to={to} 
      className="text-lg font-medium text-gray-800 hover:text-primary-600 transition-colors duration-200"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Header;