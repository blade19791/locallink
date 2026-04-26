import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Clock, ShieldCheck, ChevronRight, Award, MessageSquare, X, Send } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ProviderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = window.location;
  
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  
  // Form states
  const [bookingForm, setBookingForm] = useState({ service_id: '', notes: '', scheduled_at: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProviderData();
    const query = new URLSearchParams(location.search);
    if (query.get('book') === 'true') {
      setIsBookingOpen(true);
    }
  }, [id, location.search]);

  const fetchProviderData = async () => {
    setLoading(true);
    try {
      const detailsRes = await fetch(`/api/providers/${id}`);
      if (!detailsRes.ok) throw new Error('Provider not found');
      const detailsData = await detailsRes.json();
      const p = detailsData.provider;

      const reviewsRes = await fetch(`/api/providers/${id}/reviews`);
      const reviewsData = reviewsRes.ok ? await reviewsRes.json() : { reviews: [] };
      
      const mappedProvider = {
        id: p.id,
        name: p.name,
        service: p.services?.map(s => s.name).join(', ') || 'Professional',
        services: p.services || [],
        location: p.location_text || 'Location Not Specified',
        rating: parseFloat(p.rating?.average || 0).toFixed(1),
        reviewCount: p.rating?.total || 0,
        isAvailable: p.is_available,
        experience: 'Verified',
        about: p.description || 'No description provided.',
        email: p.email || 'N/A',
        phone: p.phone || 'N/A',
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&size=200&background=random`,
        skills: p.services?.map(s => s.name) || [],
        reviews: reviewsData.reviews.map(r => ({
          id: r.id,
          user: r.reviewer_name,
          date: new Date(r.created_at).toLocaleDateString(),
          rating: r.rating,
          text: r.comment
        }))
      };
      setProvider(mappedProvider);
      if (mappedProvider.services.length > 0) {
        setBookingForm(prev => ({ ...prev, service_id: mappedProvider.services[0].id }));
      }
    } catch (error) {
      console.error('Error fetching provider:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
       navigate('/login', { state: { from: `/providers/${id}?book=true` } });
       return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          provider_id: id,
          ...bookingForm
        })
      });
      if (response.ok) {
        alert('Hiring request sent successfully!');
        setIsBookingOpen(false);
      } else {
        const data = await response.json();
        alert(data.message || 'Booking failed');
      }
    } catch (error) {
      alert('Error sending booking request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/providers/${id}` } });
      return;
    }
    setSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          provider_id: id,
          ...reviewForm
        })
      });
      if (response.ok) {
        alert('Review submitted! Thank you.');
        setIsReviewOpen(false);
        fetchProviderData(); // Refresh reviews
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!provider) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-3xl font-bold text-white mb-4">Provider not found</h2>
      <Link to="/search" className="btn-primary">Back to search</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-32">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-6 flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/search" className="hover:text-white transition-colors">Search</Link>
        <ChevronRight size={14} />
        <span className="text-slate-300">{provider.name}</span>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-2">
            <div className="glass-card mb-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-slate-800 flex-shrink-0 overflow-hidden border-4 border-slate-900 shadow-2xl">
                  <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-4xl font-display font-bold text-white">{provider.name}</h1>
                    <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-[10px] font-bold uppercase tracking-wider border border-primary-500/20">
                      Verified Pro
                    </span>
                  </div>
                  <p className="text-xl text-primary-400 font-medium mb-4">{provider.service}</p>
                  
                  <div className="flex flex-wrap gap-6 text-slate-400 text-sm mb-6">
                    <span className="flex items-center gap-2">
                      <Star size={18} className="fill-amber-400 text-amber-400" />
                      <strong className="text-white">{provider.rating}</strong> ({provider.reviewCount} reviews)
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={18} />
                      {provider.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Award size={18} />
                      {provider.experience} Exp.
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {provider.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs border border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">About</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                {provider.about}
              </p>
            </div>

            <div className="glass-card">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Guest Reviews</h2>
                <button 
                  onClick={() => setIsReviewOpen(true)}
                  className="text-primary-400 text-sm font-semibold hover:underline"
                >
                  Write a review
                </button>
              </div>
              
              <div className="space-y-8">
                {provider.reviews.length > 0 ? provider.reviews.map(review => (
                  <div key={review.id} className="pb-8 border-b border-slate-800 last:border-none last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white">{review.user}</h4>
                      <span className="text-xs text-slate-500">{review.date}</span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'} />
                      ))}
                    </div>
                    <p className="text-slate-400 leading-relaxed italic">"{review.text}"</p>
                  </div>
                )) : (
                  <p className="text-slate-600 italic">No reviews yet. Be the first to rate!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="glass-card border-primary-500/30">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-slate-400 text-sm">Status</div>
                   {provider.isAvailable ? (
                    <span className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold text-xs uppercase tracking-wider">Busy</span>
                  )}
                </div>
                
                <div className="space-y-4 mb-8">
                  <button 
                    onClick={() => setIsBookingOpen(true)}
                    className="btn-primary w-full group py-4"
                  >
                    Hire Now
                  </button>
                  <a href={`tel:${provider.phone}`} className="btn-secondary w-full py-4 flex items-center justify-center gap-2">
                    <Phone size={18} />
                    Call
                  </a>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-800">
                   <div className="flex items-center gap-3 text-sm text-slate-400">
                     <Clock size={16} className="text-primary-400" />
                     Response time: ~15 mins
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-400">
                     <ShieldCheck size={16} className="text-primary-400" />
                     Background checked pro
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-400">
                     <MessageSquare size={16} className="text-primary-400" />
                     100% Satisfaction Rate
                   </div>
                </div>
              </div>

              <div className="glass-card bg-primary-900/10 border-primary-500/20 text-center">
                <h4 className="text-white font-bold mb-2">Verified Professional</h4>
                <p className="text-slate-400 text-xs">This provider has been manually verified by our team for quality and reliability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Hire {provider.name}</h2>
                <button onClick={() => setIsBookingOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleBooking} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Select Service</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-all"
                    value={bookingForm.service_id}
                    onChange={e => setBookingForm({...bookingForm, service_id: e.target.value})}
                  >
                    {provider.services.map(s => (
                       <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Preferred Date/Time</label>
                  <input 
                    type="datetime-local"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-all"
                    value={bookingForm.scheduled_at}
                    onChange={e => setBookingForm({...bookingForm, scheduled_at: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Additional Notes</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-all resize-none"
                    placeholder="Tell the provider more about the task..."
                    value={bookingForm.notes}
                    onChange={e => setBookingForm({...bookingForm, notes: e.target.value})}
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2">
                  {submitting ? 'Sending...' : <><Send size={18} /> Request Appointment</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Rate {provider.name}</h2>
                <button onClick={() => setIsReviewOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleReview} className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Star Rating</label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className={`p-3 rounded-xl transition-all ${reviewForm.rating >= star ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-600'}`}
                      >
                        <Star className={reviewForm.rating >= star ? 'fill-amber-400' : ''} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Your Experience</label>
                  <textarea 
                    rows={4}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-all resize-none"
                    placeholder="What was it like working with this professional?"
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2">
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProviderDetails;

