import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Lock, CheckCircle2, Navigation, Loader2 } from 'lucide-react';

const serviceOptions = [
  'Plumber', 'Electrician', 'Mechanic', 'Carpenter', 'Cleaning', 'Painting', 'Gardening', 'HVAC'
];

const ProviderRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    services: []
  });
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleLocationDetection = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({ ...prev, location: `${position.coords.latitude}, ${position.coords.longitude}` }));
          setIsLocating(false);
        },
        () => setIsLocating(false)
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          location_text: formData.location,
          role: 'provider'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card max-w-lg text-center py-16"
        >
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">Registration Received!</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Thank you for joining LocalLink. Your account is currently <strong>under review</strong> by our administration team. You will receive an email once your profile is approved.
          </p>
          <button onClick={() => window.location.href = '/'} className="btn-primary px-10">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Join as a Provider</h1>
          <p className="text-slate-400">Expand your business and reach more clients in your area.</p>
        </div>

        <div className="glass-card">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type="text" name="name" required className="input-field pl-12" placeholder="John Miller" value={formData.name} onChange={handleInputChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type="email" name="email" required className="input-field pl-12" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type="tel" name="phone" required className="input-field pl-12" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type="password" name="password" required className="input-field pl-12" placeholder="••••••••" value={formData.password} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="text" name="location" required className="input-field pl-12 pr-12" placeholder="City, State or Zip" value={formData.location} onChange={handleInputChange} />
                <button type="button" onClick={handleLocationDetection} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-400 transition-colors ${isLocating ? 'animate-spin' : ''}`}>
                  {isLocating ? <Loader2 size={18} /> : <Navigation size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-primary-400" />
                Services Offered (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {serviceOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleService(option)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${formData.services.includes(option) ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button disabled={loading || formData.services.length === 0} type="submit" className="btn-primary w-full py-4 text-lg">
                {loading ? <Loader2 className="animate-spin" /> : 'Create Professional Account'}
              </button>
              <p className="text-center mt-6 text-xs text-slate-500">
                By signing up, you agree to our Terms of Service and Privacy Policy. All providers must undergo verification before approval.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistration;
