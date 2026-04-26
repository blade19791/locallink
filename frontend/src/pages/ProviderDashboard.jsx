import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, CheckCircle2, XCircle, Clock, Star, MapPin, Phone, Mail, Edit3, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProviderDashboard = () => {
  const { user, updateUser } = useAuth();
  const [isAvailable, setIsAvailable] = useState(user?.is_available ?? true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    service: user?.service_name || '',
    phone: user?.phone || '',
    location: user?.location_text || '',
    bio: user?.description || ''
  });
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    fetchBookings();
    const fetchFullProfile = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/providers/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const p = data.provider;
          setProfile({
            name: p.name,
            service: p.services?.map(s => s.name).join(', ') || '',
            phone: p.phone || '',
            location: p.location_text || '',
            bio: p.description || ''
          });
          setIsAvailable(p.is_available);
          updateUser({ ...p });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchFullProfile();
  }, [user?.id]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
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
      setLoadingBookings(false);
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const toggleAvailability = async () => {

    const newStatus = !isAvailable;
    try {
      const response = await fetch('/api/providers/availability', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ is_available: newStatus })
      });
      if (response.ok) {
        setIsAvailable(newStatus);
        updateUser({ is_available: newStatus });
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const stats = [
    { label: 'Rating', value: user?.rating?.average || '0.0', icon: Star, color: 'text-amber-400' },
    { label: 'Total Reviews', value: user?.rating?.total || '0', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Response', value: '15m', icon: Clock, color: 'text-primary-400' },
  ];

  const handleSave = async () => {
    setIsEditing(false);
    try {
      // Map frontend fields to backend expectations
      let lat = 0, lng = 0;
      if (profile.location.includes(',')) {
        const parts = profile.location.split(',');
        lat = parseFloat(parts[0]);
        lng = parseFloat(parts[1]);
      }

      const response = await fetch('/api/providers/profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          phone: profile.phone,
          location_text: profile.location,
          latitude: isNaN(lat) ? 0 : lat,
          longitude: isNaN(lng) ? 0 : lng,
          description: profile.bio,
          is_available: isAvailable
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        updateUser({ ...data.profile, name: profile.name });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };


  return (
    <div className="min-h-screen py-12 px-6 bg-slate-950">
      <div className="container mx-auto max-w-6xl">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">Welcome, {profile.name}</h1>
            <p className="text-slate-400 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${user?.is_approved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              Provider Dashboard <span className="text-slate-700">•</span> {user?.is_approved ? 'Approved' : 'Pending Approval'}
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
            <span className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isAvailable ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isAvailable ? 'Available Now' : 'Off Duty'}
            </span>
            <button 
              onClick={toggleAvailability}
              className={`relative w-14 h-8 rounded-full transition-colors ${isAvailable ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Stats Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="grid grid-cols-1 gap-4">
              {stats.map(stat => (
                <div key={stat.label} className="glass-card flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-slate-800 ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{stat.label}</p>
                      <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Settings size={18} className="text-primary-400" />
                Quick Settings
              </h3>
              <div className="space-y-4">
                <button className="w-full btn-secondary text-sm justify-start">Notification Preferences</button>
                <button className="w-full btn-secondary text-sm justify-start">Billing & Payouts</button>
                <button className="w-full btn-secondary text-sm justify-start text-red-400 hover:bg-red-500/10 hover:border-red-500/20">Deactivate Profile</button>
              </div>
            </div>
          </div>

          {/* Profile Edit Column */}
          <div className="lg:col-span-2">
            <div className="glass-card">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                <button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`btn-${isEditing ? 'primary' : 'secondary'} py-2 px-5 text-sm`}
                >
                  {isEditing ? <><Save size={16} /> Save Changes</> : <><Edit3 size={16} /> Edit Profile</>}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Name</label>
                    <input 
                      disabled={!isEditing}
                      className={`w-full bg-slate-900 border ${isEditing ? 'border-primary-500/50 focus:border-primary-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-white transition-all`}
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Primary Service</label>
                    <input 
                      disabled={!isEditing}
                      className={`w-full bg-slate-900 border ${isEditing ? 'border-primary-500/50 focus:border-primary-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-white transition-all`}
                      value={profile.service}
                      onChange={(e) => setProfile({...profile, service: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone</label>
                    <input 
                      disabled={!isEditing}
                      className={`w-full bg-slate-900 border ${isEditing ? 'border-primary-500/50 focus:border-primary-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-white transition-all`}
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location</label>
                    <input 
                      disabled={!isEditing}
                      className={`w-full bg-slate-900 border ${isEditing ? 'border-primary-500/50 focus:border-primary-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-white transition-all`}
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Professional Bio</label>
                <textarea 
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full bg-slate-900 border ${isEditing ? 'border-primary-500/50 focus:border-primary-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-white transition-all resize-none`}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                />
              </div>
            </div>

            {/* Job Requests */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-6">Recent Job Requests</h3>
              <div className="space-y-4">
                {bookings.length > 0 ? bookings.map((booking) => (
                  <div key={booking.id} className="glass p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800/50 hover:bg-slate-900/40 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-primary-400 text-lg">
                        {booking.client_name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-base text-white font-bold">{booking.client_name}</p>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                            booking.status === 'confirmed' ? 'text-emerald-400 bg-emerald-500/10' : 
                            booking.status === 'pending' ? 'text-amber-400 bg-amber-500/10' : 
                            'text-slate-400 bg-slate-500/10'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">Request for <span className="text-primary-400 font-medium">{booking.service_name}</span></p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Clock size={12} /> {booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleString() : 'As soon as possible'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       {booking.status === 'pending' && (
                         <>
                           <button 
                             onClick={() => handleBookingStatus(booking.id, 'confirmed')}
                             className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/20"
                           >
                              <CheckCircle2 size={18} />
                           </button>
                           <button 
                             onClick={() => handleBookingStatus(booking.id, 'cancelled')}
                             className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                           >
                              <XCircle size={18} />
                           </button>
                         </>
                       )}
                       {booking.status === 'confirmed' && (
                          <button 
                            onClick={() => handleBookingStatus(booking.id, 'completed')}
                            className="btn-primary py-2 px-4 text-xs"
                          >
                             Mark Completed
                          </button>
                       )}
                    </div>
                  </div>
                )) : (
                  <div className="py-12 glass-card text-center italic text-slate-500">
                    No hiring requests received yet.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
