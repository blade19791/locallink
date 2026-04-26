import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, User, LogOut, LayoutDashboard, Settings, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <MapPin className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-white">
            Local<span className="text-primary-400">Link</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm font-medium hover:text-primary-400 transition-colors ${location.pathname === '/' ? 'text-primary-400' : 'text-slate-300'}`}>Home</Link>
          <Link to="/search" className={`text-sm font-medium hover:text-primary-400 transition-colors ${location.pathname === '/search' ? 'text-primary-400' : 'text-slate-300'}`}>Find Services</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'client' && (
                <Link to="/my-bookings" className="text-sm font-medium text-slate-300 hover:text-white transition-colors mr-2">My Bookings</Link>
              )}
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-secondary py-2 px-4 text-xs">
                {user.role === 'admin' ? <Shield size={16} /> : <LayoutDashboard size={16} />}
                {user.role === 'admin' ? 'Admin' : 'Dashboard'}
              </Link>

              <button 
                onClick={logout}
                className="text-slate-300 hover:text-white transition-colors"
                title="Log Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</Link>
              <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
                <Link to="/register" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign Up</Link>
                <Link to="/register-provider" className="btn-primary py-2.5 px-5 text-sm">Join as Provider</Link>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-300 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-slate-800/50 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">Home</Link>
          <Link to="/search" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">Find Services</Link>
          <hr className="border-slate-800" />
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">
                {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <button 
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-lg font-medium text-red-400"
              >
                <LogOut size={20} /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">Log In</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">Sign Up</Link>
              <Link to="/register-provider" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full text-center">Join as Provider</Link>
            </>
          )}
        </div>

      )}
    </nav>
  );
};

export default Navbar;
