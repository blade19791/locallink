import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookings/my', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6 bg-slate-950">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-3">
            <Calendar className="text-primary-400" />
            My Bookings
          </h1>
          <p className="text-slate-400">Track your service requests and hiring history.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {bookings.length > 0 ? bookings.map((booking) => (
                <motion.div 
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card group"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-2xl text-slate-400">
                        {booking.provider_name ? booking.provider_name[0] : '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{booking.provider_name}</h3>
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                            booking.status === 'confirmed' ? 'text-emerald-400 bg-emerald-500/10' : 
                            booking.status === 'pending' ? 'text-amber-400 bg-amber-500/10' : 
                            booking.status === 'cancelled' ? 'text-red-400 bg-red-500/10' :
                            'text-slate-400 bg-slate-500/10'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-primary-400 font-medium mb-4">{booking.service_name}</p>
                        
                        <div className="flex flex-wrap gap-6 text-sm text-slate-500">
                          <span className="flex items-center gap-2">
                            <Clock size={16} className="text-slate-600" />
                            {booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleString() : 'ASAP'}
                          </span>
                          <span className="flex items-center gap-2 text-xs italic">
                            <MessageSquare size={16} className="text-slate-600" />
                            {booking.notes || 'No extra notes provided'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between items-end">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1">Requested On</p>
                        <p className="text-sm text-slate-400">{new Date(booking.created_at).toLocaleDateString()}</p>
                      </div>
                      
                      {booking.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          className="mt-4 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
                        >
                          Cancel Request
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                         <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-widest">
                            <CheckCircle2 size={14} /> Provider Confirmed
                         </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="py-20 text-center glass-card">
                   <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-700">
                      <AlertCircle size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">No Bookings Yet</h3>
                   <p className="text-slate-500 mb-8">You haven't hired any professionals yet. Start exploring local services!</p>
                   <a href="/search" className="btn-primary">Find a Pro</a>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientBookings;
