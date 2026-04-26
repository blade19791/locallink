import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Globe, Share2, HelpCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MapPin className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-white">
                Local<span className="text-primary-400">Link</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Connecting you with top-rated local professionals. From plumbing to electrical work, find the help you need in seconds.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-400 transition-all">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-400 transition-all">
                <Share2 size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-400 transition-all">
                <HelpCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/search" className="text-slate-400 hover:text-white transition-colors text-sm">Find Services</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors text-sm">Become a Provider</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Services</h4>
            <ul className="space-y-4">
              <li><Link to="/search?service=Plumber" className="text-slate-400 hover:text-white transition-colors text-sm">Plumbing</Link></li>
              <li><Link to="/search?service=Electrician" className="text-slate-400 hover:text-white transition-colors text-sm">Electrical</Link></li>
              <li><Link to="/search?service=Mechanic" className="text-slate-400 hover:text-white transition-colors text-sm">Mechanic</Link></li>
              <li><Link to="/search?service=Cleaning" className="text-slate-400 hover:text-white transition-colors text-sm">Cleaning</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={16} className="text-primary-400" />
                support@locallink.com
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={16} className="text-primary-400" />
                +1 (555) 000-0000
              </li>
              <li className="mt-6">
                <div className="glass p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-500 mb-2">Subscribe to our newsletter</p>
                  <div className="flex gap-2">
                    <input type="email" placeholder="Email" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary-500 w-full" />
                    <button className="bg-primary-600 p-1.5 rounded-lg text-white"><Mail size={14} /></button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} LocalLink. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
